from schemas.ai_output import AiOutputSchema

ALLOWED_KPIS = {
    "Employee Engagement",
    "Performance",
    "Retention",
    "Communication",
    "Leadership",
    "Development",
    "Well-being",
    "Collaboration",
}


def verify_evidence_quotes(transcript: str, data: AiOutputSchema) -> list[str]:
    """Return list of quotes that do NOT appear verbatim in the transcript."""
    failures = []
    for idx, item in enumerate(data.evidence):
        quote = item.quote.strip()
        if quote and quote not in transcript:
            failures.append(f"Evidence[{idx}]: '{quote[:60]}...' not found in transcript")
    return failures


def verify_kpi_allowlist(data: AiOutputSchema) -> list[str]:
    """Return list of KPIs that are not in the allowed set."""
    failures = []
    for idx, kpi in enumerate(data.kpis):
        name = kpi.kpi_name.strip()
        if name and name not in ALLOWED_KPIS:
            failures.append(f"KPI[{idx}]: '{name}' is not in allowed KPI list")
    return failures


def run_all_guardrails(transcript: str, data: AiOutputSchema) -> tuple[bool, list[str]]:
    """Run all guardrail checks. Returns (passed, list_of_issues)."""
    issues = []
    issues.extend(verify_evidence_quotes(transcript, data))
    issues.extend(verify_kpi_allowlist(data))
    passed = len(issues) == 0
    return passed, issues
