from pydantic import BaseModel, Field


class MvpOutput(BaseModel):
    """Lightweight MVP output — score, strengths, weaknesses, optional follow-ups."""

    score: int = Field(..., ge=1, le=10, description="Overall score 1–10")
    strengths: list[str] = Field(default_factory=list, description="Positive aspects")
    weaknesses: list[str] = Field(default_factory=list, description="Areas to improve")
    follow_up_questions: list[str] = Field(
        default_factory=list, description="Optional clarifying questions"
    )
