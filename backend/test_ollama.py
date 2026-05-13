r"""
Standalone test script to verify backend -> Ollama connectivity.
Run this directly without starting FastAPI:

    cd backend
    .\venv\Scripts\python.exe test_ollama.py
"""
import asyncio
import sys

import httpx

OLLAMA_URL = "http://localhost:11434"
MODEL = "phi3:mini"
TIMEOUT = 120


async def test_tags():
    """Test basic connectivity to Ollama."""
    print(f"\n[TEST 1] GET {OLLAMA_URL}/api/tags")
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.get(f"{OLLAMA_URL}/api/tags")
            print(f"  Status: {resp.status_code}")
            data = resp.json()
            models = [m.get("name", "") for m in data.get("models", [])]
            print(f"  Models: {models}")
            available = any(MODEL in name for name in models)
            print(f"  '{MODEL}' available: {available}")
            return available
    except Exception as exc:
        print(f"  FAILED: {exc}")
        return False


async def test_generate_minimal():
    """Test generation with the smallest possible prompt."""
    print(f"\n[TEST 2] POST {OLLAMA_URL}/api/generate (minimal prompt)")
    payload = {
        "model": MODEL,
        "prompt": 'Reply with JSON only: {"hello": true}',
        "stream": False,
    }
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.post(f"{OLLAMA_URL}/api/generate", json=payload)
            print(f"  Status: {resp.status_code}")
            data = resp.json()
            raw = data.get("response", "").strip()
            print(f"  Response: {raw[:200]!r}")
            return True
    except Exception as exc:
        print(f"  FAILED: {exc}")
        return False


async def test_generate_real():
    """Test generation with a realistic transcript prompt."""
    print(f"\n[TEST 3] POST {OLLAMA_URL}/api/generate (realistic prompt)")
    prompt = (
        'Analyze this transcript and return ONLY raw JSON.\n\n'
        'Transcript:\n'
        '"""\n'
        'Sarah said she appreciates the clear goals but feels overwhelmed by deadlines. '
        'She did not mention development plans.\n'
        '"""\n\n'
        'Required output fields:\n'
        '- evidence: array of {quote, sentiment, context}\n'
        '- rubric: {score (1-10), justification, confidence}\n'
        '- kpis: array of {kpi_name, relevance, evidence_indices}\n'
        '- gaps: array of {dimension, importance, rationale}\n'
        '- follow_up_questions: array of {question, target_gap}\n\n'
        'Rules: verbatim quotes only, no markdown blocks, no invented data.'
    )
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
    }
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.post(f"{OLLAMA_URL}/api/generate", json=payload)
            print(f"  Status: {resp.status_code}")
            data = resp.json()
            raw = data.get("response", "").strip()
            print(f"  Response length: {len(raw)}")
            print(f"  Response preview: {raw[:300]!r}")
            return True
    except Exception as exc:
        print(f"  FAILED: {exc}")
        return False


async def main():
    print("=" * 60)
    print("Trinethra Ollama Connectivity Test")
    print("=" * 60)
    print(f"Target URL: {OLLAMA_URL}")
    print(f"Target Model: {MODEL}")
    print(f"Timeout: {TIMEOUT}s")

    ok1 = await test_tags()
    ok2 = await test_generate_minimal()
    ok3 = await test_generate_real()

    print("\n" + "=" * 60)
    if ok1 and ok2 and ok3:
        print("ALL TESTS PASSED")
        print("Your backend should be able to reach Ollama.")
    else:
        print("SOME TESTS FAILED")
        if not ok1:
            print("  -> Is 'ollama serve' running?")
            print("  -> Is the OLLAMA_URL correct?")
        if ok1 and not ok2:
            print("  -> Is the model downloaded? Run: ollama pull phi3:mini")
            print("  -> Try restarting Ollama.")
    print("=" * 60)
    sys.exit(0 if (ok1 and ok2 and ok3) else 1)


if __name__ == "__main__":
    asyncio.run(main())
