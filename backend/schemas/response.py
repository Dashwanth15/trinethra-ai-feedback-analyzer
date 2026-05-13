from pydantic import BaseModel, Field

from .ai_output import MvpOutput


class AnalyzeResponse(BaseModel):
    success: bool
    data: MvpOutput | None = None
    error_type: str | None = None
    error_message: str | None = None
    processing_time_ms: int = 0
