from typing import Literal
from pydantic import BaseModel, Field


class EvidenceItem(BaseModel):
    quote: str = Field(..., description="Verbatim quote from transcript")
    sentiment: Literal["positive", "negative", "neutral"]
    context: str = Field(
        ..., description="1-sentence explanation of why this quote matters"
    )


class Rubric(BaseModel):
    score: int = Field(..., ge=1, le=10)
    justification: str = Field(
        ..., description="Paragraph citing evidence indices"
    )
    confidence: Literal["high", "medium", "low"]


class KpiMapping(BaseModel):
    kpi_name: str = Field(..., description="Standard HR KPI name")
    relevance: Literal["direct", "indirect", "inferred"]
    evidence_indices: list[int] = Field(default_factory=list)


class GapItem(BaseModel):
    dimension: str = Field(..., description="Missing assessment dimension")
    importance: Literal["critical", "important", "nice_to_have"]
    rationale: str


class FollowUpQuestion(BaseModel):
    question: str
    target_gap: str = Field(
        ..., description="Which gap this question addresses"
    )


class AiOutputSchema(BaseModel):
    evidence: list[EvidenceItem]
    rubric: Rubric
    kpis: list[KpiMapping]
    gaps: list[GapItem]
    follow_up_questions: list[FollowUpQuestion]
