import json
import logging
import re
import time
from pathlib import Path

import jinja2

from core.exceptions import JSONParseError, LLMError
from schemas.ai_output import MvpOutput
from schemas.response import AnalyzeResponse
from services.ollama_client import OllamaClient

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"
logger = logging.getLogger(__name__)


class FeedbackAnalyzer:
    def __init__(self, client: OllamaClient | None = None):
        self.client = client or OllamaClient()
        self.env = jinja2.Environment(
            loader=jinja2.FileSystemLoader(str(PROMPTS_DIR)),
            autoescape=False,
        )
        self.system_prompt = (PROMPTS_DIR / "system_prompt.txt").read_text(encoding="utf-8")

    async def analyze(self, transcript: str) -> AnalyzeResponse:
        start_time = time.time()
        logger.info(f"[ANALYZE] transcript_len={len(transcript)}")

        try:
            template = self.env.get_template("analysis_prompt.j2")
            prompt = template.render(transcript=transcript)

            raw_output = await self.client.generate(prompt=prompt, system=self.system_prompt)
            logger.info(f"[RAW] {raw_output[:300]!r}")

            data = self._parse_and_validate(raw_output)

            processing_time = int((time.time() - start_time) * 1000)
            logger.info(f"[DONE] score={data.score} | time_ms={processing_time}")

            return AnalyzeResponse(
                success=True,
                data=data,
                processing_time_ms=processing_time,
            )

        except (JSONParseError, LLMError) as exc:
            processing_time = int((time.time() - start_time) * 1000)
            logger.error(f"[FAIL] {type(exc).__name__}: {exc}")
            return AnalyzeResponse(
                success=False,
                error_type=type(exc).__name__,
                error_message=self._friendly_error(exc),
                processing_time_ms=processing_time,
            )
        except Exception as exc:
            processing_time = int((time.time() - start_time) * 1000)
            logger.error(f"[FAIL] unexpected: {exc}")
            return AnalyzeResponse(
                success=False,
                error_type="unknown",
                error_message="An unexpected error occurred. Please try again.",
                processing_time_ms=processing_time,
            )

    def _parse_and_validate(self, raw: str) -> MvpOutput:
        """Extract JSON from the LLM response and validate it into MvpOutput."""
        parsed = _extract_json(raw)

        # Coerce score to int in case model returns a float/string
        if "score" in parsed:
            try:
                parsed["score"] = int(parsed["score"])
            except (ValueError, TypeError):
                parsed["score"] = 5

        # Ensure list fields are actually lists of strings
        for field in ("strengths", "weaknesses", "follow_up_questions"):
            if field not in parsed or not isinstance(parsed[field], list):
                parsed[field] = []
            else:
                parsed[field] = [str(item) for item in parsed[field] if item]

        # Clamp score to valid range
        parsed["score"] = max(1, min(10, parsed["score"]))

        try:
            return MvpOutput.model_validate(parsed)
        except Exception as exc:
            raise JSONParseError(f"Schema validation failed: {exc}")

    @staticmethod
    def _friendly_error(exc: Exception) -> str:
        if isinstance(exc, LLMError):
            return str(exc)
        return (
            "The AI response could not be parsed. "
            "Try a shorter or clearer transcript and retry."
        )


def _extract_json(raw: str) -> dict:
    """Fast, lightweight JSON extraction from raw LLM text."""
    if not raw or not raw.strip():
        raise JSONParseError("Empty response from model.")

    text = raw.strip()

    # Strip markdown fences if present
    fence = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL | re.IGNORECASE)
    if fence:
        text = fence.group(1).strip()

    # Find first { ... last }
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = text[start: end + 1]
        # Remove trailing commas (common LLM mistake)
        candidate = re.sub(r",\s*([\]}])", r"\1", candidate)
        try:
            return json.loads(candidate)
        except json.JSONDecodeError as exc:
            raise JSONParseError(f"JSON decode error: {exc} | raw={candidate[:200]}")

    raise JSONParseError(f"No JSON object found in model output: {text[:200]}")
