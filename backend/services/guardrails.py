from schemas.ai_output import MvpOutput


def verify_evidence_quotes(transcript: str, data: MvpOutput) -> list[str]:
    """Return list of quotes that do NOT appear verbatim in the transcript."""
    failures = []
    for idx, quote in enumerate(data.evidence):
        quote = quote.strip()
        if quote and quote not in transcript:
            failures.append(f"Evidence[{idx}]: '{quote[:60]}...' not found in transcript")
    return failures


def run_all_guardrails(transcript: str, data: MvpOutput) -> tuple[bool, list[str]]:
    """Run all guardrail checks. Returns (passed, list_of_issues)."""
    issues = verify_evidence_quotes(transcript, data)
    passed = len(issues) == 0
    return passed, issues
