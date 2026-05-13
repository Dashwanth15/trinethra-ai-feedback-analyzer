from pydantic import BaseModel, Field


class MvpOutput(BaseModel):
    """
    Full DeepThought-aligned output schema.
    Flat structure for fast phi3:mini inference.
    """
    score: int = Field(..., ge=1, le=10, description="Overall effectiveness score 1–10")
    summary: str = Field(default="", description="One-sentence analysis summary")
    strengths: list[str] = Field(default_factory=list, description="Positive aspects observed")
    weaknesses: list[str] = Field(default_factory=list, description="Areas needing improvement")
    evidence: list[str] = Field(default_factory=list, description="Direct quotes or phrases from transcript")
    gaps: list[str] = Field(default_factory=list, description="Topics supervisor did NOT address")
    questions: list[str] = Field(default_factory=list, description="Suggested follow-up questions")
