from fastapi import APIRouter, Depends

from api.dependencies import get_analyzer, get_ollama_client
from schemas.request import AnalyzeRequest
from schemas.response import AnalyzeResponse
from services.analyzer import FeedbackAnalyzer
from services.ollama_client import OllamaClient

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_feedback(
    request: AnalyzeRequest,
    analyzer: FeedbackAnalyzer = Depends(get_analyzer),
) -> AnalyzeResponse:
    """Analyze a supervisor feedback transcript."""
    return await analyzer.analyze(request.transcript)


@router.get("/health")
async def health_check(client: OllamaClient = Depends(get_ollama_client)) -> dict:
    """Check Ollama connectivity and model availability."""
    return await client.health_check()


@router.post("/retry", response_model=AnalyzeResponse)
async def retry_analysis(
    request: AnalyzeRequest,
    analyzer: FeedbackAnalyzer = Depends(get_analyzer),
) -> AnalyzeResponse:
    """Re-analyze with stricter prompt settings."""
    # The retry endpoint uses the same analyzer but could be extended
    # to force higher temperature or stricter system prompt
    return await analyzer.analyze(request.transcript)
