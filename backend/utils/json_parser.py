import json
import re

from core.exceptions import JSONParseError


def extract_json(raw: str) -> dict:
    """Extract and parse JSON from raw LLM output with multiple fallback strategies."""
    if not raw or not raw.strip():
        raise JSONParseError("Empty response from LLM")

    cleaned = raw.strip()

    # Strategy 1: Extract from ```json ... ``` fences
    fence_pattern = re.compile(r"```json\s*(.*?)\s*```", re.DOTALL | re.IGNORECASE)
    match = fence_pattern.search(cleaned)
    if match:
        candidate = match.group(1).strip()
        parsed = _try_parse(candidate)
        if parsed is not None:
            return parsed

    # Strategy 2: Extract from ``` ... ``` fences (no json tag)
    fence_pattern2 = re.compile(r"```\s*(.*?)\s*```", re.DOTALL)
    match2 = fence_pattern2.search(cleaned)
    if match2:
        candidate = match2.group(1).strip()
        parsed = _try_parse(candidate)
        if parsed is not None:
            return parsed

    # Strategy 3: Find first '{' and last '}'
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = cleaned[start : end + 1]
        parsed = _try_parse(candidate)
        if parsed is not None:
            return parsed

    # Strategy 4: Try parsing the whole string
    parsed = _try_parse(cleaned)
    if parsed is not None:
        return parsed

    raise JSONParseError(f"Could not extract valid JSON from response: {cleaned[:200]}...")


def _try_parse(text: str) -> dict | None:
    """Attempt to parse text as JSON, with lightweight repair."""
    if not text:
        return None

    # Repair 1: Remove trailing commas before ] or }
    repaired = re.sub(r",\s*(\]|\})", r"\1", text)

    # Repair 2: Replace single quotes used as JSON delimiters (carefully)
    # This is risky; we only do it if double-quote parse fails
    try:
        return json.loads(repaired)
    except json.JSONDecodeError:
        pass

    # Repair 3: Try replacing outer single quotes (simple heuristic)
    if repaired.startswith("'") and repaired.endswith("'"):
        try:
            return json.loads(repaired[1:-1])
        except json.JSONDecodeError:
            pass

    return None
