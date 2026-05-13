from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    transcript: str = Field(
        ...,
        min_length=20,
        max_length=15000,
        description="Supervisor feedback transcript to analyze",
    )
