import time
from pathlib import Path

import jinja2

from core.config import settings
from core.exceptions import HallucinationError, JSONParseError, LLMError, ValidationError
from schemas.ai_output import AiOutputSchema
from schemas.response import AnalyzeResponse
from services.guardrails import run_all_guardrails
from services.ollama_client import OllamaClient
from utils.json_parser import extract_json

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


class FeedbackAnalyzer:
    def __init__(self, client: OllamaClient | None = None):
        self.client = client or OllamaClient()
        self.env = jinja2.Environment(
            loader=jinja2.FileSystemLoader(str(PROMPTS_DIR)),
            autoescape=False,
        )
        self.system_prompt = self._load_system_prompt()
        self.schema_json = AiOutputSchema.model_json_schema()

    def _load_system_prompt(self) -> str:
        path = PROMPTS_DIR / "system_prompt.txt"
        return path.read_text(encoding="utf-8")

    async def analyze(self, transcript: str) -> AnalyzeResponse:
        start_time = time.time()
        retry_count = 0
        last_error = ""
        last_raw = ""

        while retry_count <= settings.MAX_RETRIES:
            try:
                raw_output = await self._call_llm(
                    transcript=transcript,
                    previous_error=last_error,
                    previous_raw_output=last_raw,
                    is_retry=retry_count > 0,
                )
                last_raw = raw_output

                parsed = extract_json(raw_output)
                data = AiOutputSchema.model_validate(parsed)

                passed, issues = run_all_guardrails(transcript, data)
                if not passed:
                    raise HallucinationError("; ".join(issues))

                processing_time = int((time.time() - start_time) * 1000)
                confidence = self._compute_confidence(retry_count, passed=True)

                return AnalyzeResponse(
                    success=True,
                    data=data,
                    confidence_label=confidence,
                    retry_count=retry_count,
                    processing_time_ms=processing_time,
                )

            except (JSONParseError, ValidationError, HallucinationError, LLMError) as exc:
                last_error = str(exc)
                retry_count += 1
                if retry_count > settings.MAX_RETRIES:
                    processing_time = int((time.time() - start_time) * 1000)
                    error_type = self._classify_error(exc)
                    return AnalyzeResponse(
                        success=False,
                        error_type=error_type,
                        error_message=self._friendly_error(error_type, last_error),
                        confidence_label="low",
                        retry_count=retry_count - 1,
                        processing_time_ms=processing_time,
                    )
                # Loop continues to retry

        # Should never reach here, but satisfy type checker
        return AnalyzeResponse(
            success=False,
            error_type="unknown",
            error_message="An unexpected error occurred",
            confidence_label="low",
            retry_count=retry_count,
            processing_time_ms=int((time.time() - start_time) * 1000),
        )

    async def _call_llm(
        self,
        transcript: str,
        previous_error: str,
        previous_raw_output: str,
        is_retry: bool,
    ) -> str:
        if is_retry:
            template = self.env.get_template("retry_prompt.j2")
            prompt = template.render(
                transcript=transcript,
                schema_json=self.schema_json,
                previous_error=previous_error,
                previous_raw_output=previous_raw_output,
            )
        else:
            template = self.env.get_template("analysis_prompt.j2")
            prompt = template.render(
                transcript=transcript,
                schema_json=self.schema_json,
            )

        return await self.client.generate(prompt=prompt, system=self.system_prompt)

    @staticmethod
    def _compute_confidence(retry_count: int, passed: bool) -> str:
        if retry_count == 0 and passed:
            return "high"
        if retry_count <= 1:
            return "medium"
        return "low"

    @staticmethod
    def _classify_error(exc: Exception) -> str:
        name = type(exc).__name__
        mapping = {
            "JSONParseError": "parse_error",
            "ValidationError": "validation_error",
            "HallucinationError": "hallucination_detected",
            "LLMError": "llm_error",
        }
        return mapping.get(name, "unknown")

    @staticmethod
    def _friendly_error(error_type: str, detail: str) -> str:
        messages = {
            "parse_error": "The AI response could not be parsed. Try rephrasing your transcript.",
            "validation_error": "The AI response was malformed. Try again with clearer input.",
            "hallucination_detected": "The AI invented information not in your transcript. Please review and retry.",
            "llm_error": "Could not reach the AI model. Make sure Ollama is running.",
        }
        return messages.get(error_type, f"Analysis failed: {detail}")
