"""Quick end-to-end generation test — run with venv python."""
import asyncio
import httpx


async def test():
    payload = {
        "model": "phi3:mini",
        "prompt": 'Reply with this exact JSON and nothing else: {"ok": true}',
        "stream": False,
    }
    timeout = httpx.Timeout(connect=10, read=180, write=30, pool=5)
    async with httpx.AsyncClient(timeout=timeout) as c:
        print("Sending request to Ollama /api/generate ...")
        r = await c.post("http://localhost:11434/api/generate", json=payload)
        print(f"Status: {r.status_code}")
        data = r.json()
        raw = data.get("response", "").strip()
        print(f"Response ({len(raw)} chars): {raw[:300]!r}")
        print("PASS" if raw else "FAIL — empty response")


asyncio.run(test())
