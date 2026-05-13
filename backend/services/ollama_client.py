import httpx

from core.config import settings
from core.exceptions import LLMError


class OllamaClient:
    def __init__(self, base_url: str = settings.OLLAMA_URL, model: str = settings.MODEL):
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.client = httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT)

    async def generate(
        self,
        prompt: str,
        system: str | None = None,
        temperature: float = 0.0,
    ) -> str:
        """Send a generate request to Ollama and return the raw text response."""
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
            },
        }
        if system:
            payload["system"] = system

        url = f"{self.base_url}/api/generate"
        try:
            response = await self.client.post(url, json=payload)
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise LLMError(f"Ollama HTTP error {exc.response.status_code}: {exc.response.text}")
        except httpx.RequestError as exc:
            raise LLMError(f"Ollama connection error: {exc}")

        data = response.json()
        raw = data.get("response", "").strip()
        if not raw:
            raise LLMError("Ollama returned empty response")
        return raw

    async def health_check(self) -> dict:
        """Check if Ollama is reachable and the model is available."""
        try:
            resp = await self.client.get(f"{self.base_url}/api/tags")
            resp.raise_for_status()
            models = resp.json().get("models", [])
            model_names = [m.get("name", "") for m in models]
            available = any(self.model in name for name in model_names)
            return {"reachable": True, "model_available": available, "models": model_names}
        except Exception as exc:
            return {"reachable": False, "model_available": False, "error": str(exc)}
