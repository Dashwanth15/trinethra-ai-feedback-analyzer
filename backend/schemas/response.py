from typing import Literal
from pydantic import BaseModel, Field

from .ai_output import AiOutputSchema


class AnalyzeResponse(BaseModel):
    success: bool
    data: AiOutputSchema | None = None
    error_type: str | None = Field(
        default=None,
        description="parse_error, validation_error, hallucination_detected",
    )
    error_message: str | None = None
    confidence_label: Literal["high", "medium", "low"] = "medium"
    retry_count: int = 0
    processing_time_ms: int = 0
