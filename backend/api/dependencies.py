from services.analyzer import FeedbackAnalyzer
from services.ollama_client import OllamaClient


_ollama_client: OllamaClient | None = None
_analyzer: FeedbackAnalyzer | None = None


def get_ollama_client() -> OllamaClient:
    global _ollama_client
    if _ollama_client is None:
        _ollama_client = OllamaClient()
    return _ollama_client


def get_analyzer() -> FeedbackAnalyzer:
    global _analyzer
    if _analyzer is None:
        _analyzer = FeedbackAnalyzer(client=get_ollama_client())
    return _analyzer
