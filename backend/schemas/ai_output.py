from pydantic import BaseModel, Field


class MvpOutput(BaseModel):
    """
    DeepThought-aligned 9-field output schema.
    Flat structure optimised for phi3:mini local inference.
    """
    score: int = Field(..., ge=1, le=10, description="Overall effectiveness score 1–10")
    summary: str = Field(default="", description="Executive-style one-sentence analysis")
    strengths: list[str] = Field(default_factory=list, description="Positive professional observations")
    weaknesses: list[str] = Field(default_factory=list, description="Professional improvement areas")
    evidence: list[str] = Field(default_factory=list, description="Verbatim phrases extracted from transcript")
    gaps: list[str] = Field(default_factory=list, description="Evaluation dimensions not addressed")
    questions: list[str] = Field(default_factory=list, description="Interview-quality follow-up questions")
    reasoning: str = Field(default="", description="Analyst note explaining the score rationale")
    confidence: str = Field(default="Moderate", description="Computed confidence: High | Moderate | Low")
