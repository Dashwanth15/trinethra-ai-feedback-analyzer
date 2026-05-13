# Trinethra — Supervisor Feedback Analyzer

An AI-powered supervisor feedback analysis tool built for psychology interns. Paste a supervisor transcript and receive structured insights including evidence extraction, rubric scoring, KPI mapping, gap analysis, and follow-up questions.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Python, FastAPI, Pydantic
- **AI**: Ollama (llama3.2:3b) running locally

## Prerequisites

- [Ollama](https://ollama.com/) installed and running locally
- `llama3.2:3b` model pulled: `ollama pull llama3.2:3b`
- Python 3.10+
- Node.js 18+

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze a transcript |
| GET | `/api/health` | Check Ollama connectivity |
| POST | `/api/retry` | Re-analyze with stricter settings |

## Architecture Highlights

- **Prompt Templates**: Jinja2 templates for system, analysis, and retry prompts
- **Schema Stitching**: Pydantic JSON schema injected into prompts for structured LLM output
- **Guardrails**: Evidence quote verification, KPI allowlist, and confidence scoring
- **Retry Strategy**: Up to 3 retries with escalating strictness on parse/validation failures
- **Human-in-the-Loop**: Confidence badges and low-confidence warnings for review

## Folder Structure

```
backend/
  api/          # FastAPI routes and dependencies
  core/         # Config, exceptions
  services/     # Analyzer, Ollama client, guardrails
  prompts/      # Jinja2 prompt templates
  schemas/      # Pydantic request/response models
  utils/        # JSON parser with fallback strategies

frontend/
  src/
    api/        # Fetch wrappers
    components/ # React UI components
    hooks/      # Custom React hooks
    utils/      # Formatters and helpers
```

## Development Notes

- The backend uses `httpx.AsyncClient` for non-blocking Ollama calls
- Frontend uses Vite's proxy to route `/api` to the backend during development
- All AI outputs are validated against strict Pydantic schemas before reaching the UI
- Evidence quotes are verified to exist verbatim in the original transcript
