import logging
import traceback

import httpx

from core.config import settings
from core.exceptions import LLMError

logger = logging.getLogger(__name__)


class OllamaClient:
    def __init__(self, base_url: str = settings.OLLAMA_URL, model: str = settings.MODEL):
        self.base_url = base_url.rstrip("/")
        self.model = model
        self._timeout = httpx.Timeout(
            connect=10.0,
            read=float(settings.REQUEST_TIMEOUT),
            write=30.0,
            pool=5.0,
        )
        self.client = httpx.AsyncClient(timeout=self._timeout)
        logger.info(f"OllamaClient ready | url={self.base_url} | model={self.model}")

    async def generate(self, prompt: str, system: str | None = None) -> str:
        """Send a generate request to Ollama and return the raw text response."""
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            # Low-RAM / low-CPU options: cap output tokens and use low temperature
            "options": {
                "num_predict": 250,
                "temperature": 0.3,
            },
        }
        if system:
            payload["system"] = system

        url = f"{self.base_url}/api/generate"
        logger.info(f"[OLLAMA] POST {url} | prompt_len={len(prompt)}")

        try:
            response = await self.client.post(url, json=payload)
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise LLMError(f"Ollama HTTP {exc.response.status_code}: {exc.response.text[:300]}")
        except httpx.TimeoutException:
            raise LLMError(
                f"Ollama timed out after {settings.REQUEST_TIMEOUT}s. "
                "Try a shorter transcript or restart Ollama."
            )
        except httpx.ConnectError:
            raise LLMError(
                f"Cannot connect to Ollama at {self.base_url}. "
                "Run 'ollama serve' in a separate terminal."
            )
        except Exception as exc:
            logger.error(f"[OLLAMA ERROR] {exc} | {traceback.format_exc()}")
            raise LLMError(f"Unexpected error: {exc}")

        try:
            data = response.json()
        except Exception as exc:
            raise LLMError(f"Ollama returned invalid JSON: {exc}")

        raw = data.get("response", "").strip()
        if not raw:
            raise LLMError("Ollama returned an empty response.")

        logger.info(f"[OLLAMA] response_len={len(raw)}")
        return raw

    async def health_check(self) -> dict:
        """Check if Ollama is reachable and the model is available."""
        result = {
            "ollama_url": self.base_url,
            "target_model": self.model,
            "reachable": False,
            "model_available": False,
        }
        try:
            resp = await self.client.get(f"{self.base_url}/api/tags")
            resp.raise_for_status()
            models_data = resp.json()
            model_names = [m.get("name", "") for m in models_data.get("models", [])]
            available = any(self.model in name for name in model_names)
            result.update({
                "reachable": True,
                "model_available": available,
                "models_found": model_names,
            })
        except httpx.ConnectError as exc:
            result["error"] = f"Cannot connect to Ollama. Is 'ollama serve' running? ({exc})"
        except Exception as exc:
            result["error"] = str(exc)
        return result
