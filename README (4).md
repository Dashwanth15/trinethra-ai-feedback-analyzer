# Trinethra — Supervisor Feedback Analyzer

> **AI-assisted transcript analysis for psychology intern supervision workflows.**
> Local inference. Evidence-backed outputs. Human review at the center.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Ollama](https://img.shields.io/badge/Ollama-phi3:mini-black?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Overview

Trinethra is a local AI workflow platform that transforms raw supervisor transcripts into structured, explainable feedback reports. It is designed for psychology internship programs where supervisors evaluate interns across multiple professional dimensions — and where the quality, accuracy, and traceability of feedback directly affects trainee development.

The system does not replace human reviewers. It surfaces evidence, identifies coverage gaps, and generates targeted follow-up questions — giving supervisors and program coordinators a structured starting point rather than a finished verdict. Every AI output is grounded in verbatim transcript evidence, validated against a strict schema, and flagged with a confidence level before it reaches the user interface.

---

## Problem Statement

Supervisor feedback in clinical and psychology training programs is typically delivered verbally or in loosely structured written form. Analyzing these transcripts at scale — across interns, sessions, and evaluation dimensions — is time-consuming and error-prone for program coordinators.

The core challenges are:

**Transcript ambiguity.** Supervisors use informal, conversational language that does not map cleanly onto structured rubric dimensions. Extracting meaningful signal from this requires more than keyword matching.

**Hallucination risk.** Language models are prone to generating plausible-sounding but ungrounded claims — a serious problem in professional evaluation contexts where fabricated evidence can mislead reviewers or misrepresent an intern's performance.

**Explainability requirements.** Assessments used in training programs must be defensible. A score without a traceable reasoning chain is not useful; neither is an evidence claim that cannot be located in the source material.

**Evaluation coverage.** A single supervisor session rarely covers all relevant competency dimensions. The system needs to identify what was assessed and, critically, what was not — so reviewers know where the transcript is incomplete rather than assuming it is comprehensive.

Trinethra was built to address these constraints directly, with design decisions at every layer of the stack chosen to minimize hallucination, maximize traceability, and keep the human reviewer in control.

---

## System Philosophy

**AI-assisted, not AI-replacing.** Trinethra generates structured analysis; it does not make decisions. Every output is presented as a reviewable artifact, not a final assessment. Confidence indicators and gap flags are designed to prompt human judgment, not substitute for it.

**Evidence before inference.** All claims surfaced in the analysis must be traceable to verbatim quotes from the source transcript. The guardrail layer verifies this automatically and rejects evidence items that cannot be located in the original text.

**Deterministic where possible.** Confidence scoring is computed programmatically from transcript length and evidence density — not delegated to the LLM. This eliminates an entire class of hallucination and ensures that confidence values are consistent and reproducible across runs.

**Structured outputs by design.** The system prompt instructs the model to return raw JSON only, with no markdown or explanation. A Pydantic schema defines the exact shape of the expected output. Responses that do not conform to the schema are rejected and retried with escalating strictness — never silently accepted.

**Local inference as a constraint, not a compromise.** Running on-device via Ollama means no data leaves the machine, no API keys are needed, and the system works in offline or restricted network environments. Prompts are written to work within the context and reasoning limits of phi3:mini, which requires deliberate simplification.

---

## Key Features

| Feature | Description |
|---|---|
| **Structured AI Output** | Nine-field JSON schema covering score, summary, strengths, weaknesses, evidence, gaps, follow-up questions, reasoning, and confidence |
| **Evidence Verification** | Verbatim quote extraction with automatic cross-referencing against the source transcript |
| **Gap Analysis** | Identification of evaluation dimensions not addressed in the session |
| **Confidence Scoring** | Deterministically computed from transcript length and evidence density — not generated by the LLM |
| **KPI Allowlist Enforcement** | All extracted KPIs validated against a fixed controlled vocabulary |
| **Retry Pipeline** | Up to 3 retries with escalating prompt strictness on parse or validation failures |
| **Human Review Dashboard** | Confidence badges, low-confidence warnings, and structured cards designed for reviewer inspection |
| **Fully Local Inference** | No external API calls, no data transmission, offline-capable by default |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend                           │
│   TranscriptInput → useAnalyze hook → API client → Dashboard   │
│   Components: ScoreCard, EvidenceList, GapAnalysis,            │
│               FollowUpQuestions, ConfidenceBadge, KpiTags      │
└────────────────────────┬────────────────────────────────────────┘
                         │ POST /api/analyze
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       FastAPI Backend                           │
│                                                                 │
│   routes.py → FeedbackAnalyzer.analyze()                       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │              Jinja2 Prompt Assembly                     │  │
│   │  system_prompt.txt + analysis_prompt.j2 (with schema)  │  │
│   └──────────────────────┬──────────────────────────────────┘  │
│                          │                                      │
│   ┌──────────────────────▼──────────────────────────────────┐  │
│   │              OllamaClient (httpx async)                 │  │
│   │              phi3:mini · local inference                │  │
│   └──────────────────────┬──────────────────────────────────┘  │
│                          │ raw text                             │
│   ┌──────────────────────▼──────────────────────────────────┐  │
│   │                JSON Extraction & Repair                 │  │
│   │   Strip fences → find {} bounds → fix trailing commas  │  │
│   └──────────────────────┬──────────────────────────────────┘  │
│                          │                                      │
│   ┌──────────────────────▼──────────────────────────────────┐  │
│   │              Pydantic Schema Validation                 │  │
│   │              MvpOutput (9 fields, typed)                │  │
│   └──────────────────────┬──────────────────────────────────┘  │
│                          │                                      │
│   ┌──────────────────────▼──────────────────────────────────┐  │
│   │                  Guardrails Layer                       │  │
│   │   Evidence quote verification · KPI allowlist check    │  │
│   │   Deterministic confidence computation                 │  │
│   └──────────────────────┬──────────────────────────────────┘  │
│                          │ AnalyzeResponse                      │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
                    React Dashboard
```

**Frontend.** Built with React 18, Vite, and Tailwind CSS. The `useAnalyze` hook manages request state and error boundaries. Vite's dev proxy routes `/api` requests to the FastAPI backend during development. Output is decomposed into purpose-specific display components — each card renders one aspect of the analysis independently, making it easy to inspect or extend individual output types.

**Backend.** FastAPI with Pydantic v2 for request/response modeling. The `FeedbackAnalyzer` service orchestrates the full pipeline: prompt rendering, LLM call, JSON extraction, schema validation, and guardrail checks. All Ollama communication is handled via `httpx.AsyncClient` for non-blocking I/O.

**Prompt assembly.** System and analysis prompts are maintained as separate Jinja2 templates. The Pydantic JSON schema is injected directly into the analysis prompt, giving the model explicit field-level instructions. This reduces the likelihood of field omission or type mismatches in the output.

**JSON extraction.** A lightweight parser handles the reality of local LLM output: markdown fences are stripped, the first valid `{...}` block is extracted, and trailing commas are repaired before `json.loads` is attempted. No external libraries required.

---

## Hallucination Guardrails

Controlling LLM output quality is the central engineering concern of this project. The following mechanisms work in combination to reduce hallucination and ensure reviewers are working with grounded, trustworthy data.

**Verbatim evidence verification.** After parsing, every evidence quote is checked for exact substring presence in the original transcript. Quotes that cannot be located are flagged as guardrail failures. This prevents the model from inventing supporting quotations — a common failure mode in extractive summarization tasks.

**JSON-only system prompt.** The system prompt instructs the model to output raw JSON with no markdown, preamble, or explanation. This is the first line of defense: removing the model's opportunity to generate free-form text reduces the surface area for hallucinated content.

**Schema-enforced structure.** The Pydantic `MvpOutput` model defines types, constraints, and defaults for all nine output fields. Responses that fail schema validation — missing required fields, wrong types, out-of-range scores — are rejected rather than passed through with partial data.

**KPI allowlist.** Extracted KPIs are validated against a fixed controlled vocabulary of eight allowed terms. This prevents the model from introducing novel or unrecognized categories that would be meaningless to reviewers.

**Deterministic confidence scoring.** Confidence (`High`, `Moderate`, `Low`) is computed entirely in Python from transcript length and evidence count — not generated by the model. This eliminates one of the most common LLM reliability failures: overconfident assessments on thin evidence.

**Retry with escalating strictness.** On parse or validation failure, the system retries up to three times using the `retry_prompt.j2` template, which includes more explicit instructions about output format. Retry attempts are logged for observability.

---

## Engineering Tradeoffs

**phi3:mini on low-RAM hardware.** The model was selected for its minimal memory footprint and ability to run on consumer hardware without GPU acceleration. This constrains reasoning depth and context capacity. Prompts are written to be as short and explicit as possible, and the output schema was kept flat (no nested objects) to reduce the chance of structural errors in the model's JSON generation.

**Flat schema over rich nesting.** An earlier schema design used nested objects for evidence items (with `quote`, `dimension`, and `relevance` fields). Under phi3:mini, nested structures produced significantly more malformed JSON. The final schema uses flat string arrays throughout, with the guardrail layer handling post-hoc validation rather than relying on the model to maintain complex structure.

**Synchronous retry over streaming.** Streaming responses would improve perceived latency but complicate JSON validation — partial JSON cannot be validated mid-stream. Given that the primary use case involves short transcripts on low-RAM hardware where total inference time is already bounded, synchronous request/response was preferred for reliability.

**No caching layer.** The current implementation does not cache identical transcript analyses. For the target use case (ad hoc review, short sessions), this was not a bottleneck. A lightweight cache keyed on transcript hash would be a straightforward addition for repeated analysis workflows.

**Evidence as strings, not structured objects.** The model reliably extracts verbatim phrases when the expected output is a flat list of strings. Asking for structured evidence objects (with separate fields for quote, context, and dimension mapping) increased parse failures significantly under phi3:mini and was removed from the schema.

---

## Assessment Coverage Logic

The gap analysis dimension identifies which professional competency areas were not addressed in the supervisor session. This is distinct from identifying weaknesses in the intern's performance — a gap is an absence of evaluation, not an evaluation of absence.

The system maps transcript content to a set of expected evaluation dimensions:

- **Employee Engagement** — intern's investment and participation in the session
- **Performance** — task execution, clinical skills, and professional conduct
- **Retention** — knowledge retention and application of prior feedback
- **Communication** — verbal and written communication quality
- **Leadership** — initiative, case ownership, and professional agency
- **Development** — growth trajectory and receptiveness to feedback
- **Well-being** — signs of stress, burnout, or support needs
- **Collaboration** — teamwork, peer relationships, and supervision dynamics

The LLM identifies which of these dimensions appear to have been evaluated in the transcript. The `gaps` field in the output schema captures dimensions that were expected but not addressed. This allows program coordinators to see at a glance whether a session was comprehensive or whether certain areas require follow-up in a subsequent supervision.

---

## Why Local LLM?

**Data privacy.** Supervision transcripts contain sensitive clinical and personal information. Running inference locally via Ollama means transcript content never leaves the machine and is never transmitted to a third-party API.

**Offline operation.** The system is designed to run without network access. This makes it usable in clinical training environments with restricted internet connectivity or institutional network policies.

**Cost control.** There are no per-token API costs. Once the model is pulled, analysis runs are free regardless of volume.

**Reproducibility.** Local inference with a fixed model version produces consistent behavior across runs. Cloud API models may be updated silently, changing output characteristics in ways that are difficult to detect or control.

**Experimentation.** Local setup makes it straightforward to swap models, adjust prompt templates, and test schema changes without incurring API costs or managing API keys.

---

## Project Structure

```
trinethra/
├── backend/
│   ├── api/
│   │   ├── routes.py              # FastAPI route handlers
│   │   └── dependencies.py        # Dependency injection setup
│   ├── core/
│   │   ├── config.py              # Environment and app configuration
│   │   └── exceptions.py          # Custom exception types (LLMError, JSONParseError)
│   ├── prompts/
│   │   ├── system_prompt.txt      # LLM role and output format instruction
│   │   ├── analysis_prompt.j2     # Main analysis template with schema injection
│   │   └── retry_prompt.j2        # Escalated strictness template for retries
│   ├── schemas/
│   │   ├── ai_output.py           # MvpOutput Pydantic model (9-field flat schema)
│   │   ├── request.py             # AnalyzeRequest model
│   │   └── response.py            # AnalyzeResponse model
│   ├── services/
│   │   ├── analyzer.py            # Core pipeline: prompt → LLM → parse → validate
│   │   ├── guardrails.py          # Evidence verification, KPI allowlist, confidence
│   │   └── ollama_client.py       # Async httpx wrapper for Ollama API
│   ├── utils/
│   │   └── json_parser.py         # JSON extraction and repair utilities
│   ├── main.py                    # FastAPI app entrypoint
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── api/
        │   └── client.js          # Fetch wrappers with error handling
        ├── components/
        │   ├── TranscriptInput.jsx     # Transcript entry and submission
        │   ├── ScoreCard.jsx           # Overall score display
        │   ├── SummaryCard.jsx         # One-sentence executive summary
        │   ├── EvidenceList.jsx        # Verbatim quote display
        │   ├── EvidenceCard.jsx        # Individual evidence item
        │   ├── GapAnalysis.jsx         # Coverage gap visualization
        │   ├── GapsCard.jsx            # Gap item display
        │   ├── FollowUpQuestions.jsx   # Generated follow-up question list
        │   ├── StrengthsWeaknessesCard.jsx
        │   ├── ConfidenceBadge.jsx     # High / Moderate / Low indicator
        │   ├── KpiTags.jsx             # Validated KPI tag display
        │   ├── RubricScore.jsx         # Rubric dimension scoring
        │   ├── ReasoningCard.jsx       # Score rationale display
        │   ├── ErrorBanner.jsx         # Error state display
        │   ├── LoadingSkeleton.jsx     # Loading state UI
        │   └── Layout.jsx             # App shell
        ├── hooks/
        │   ├── useAnalyze.js          # Analysis request state management
        │   └── useClipboard.js        # Clipboard utility hook
        └── utils/
            └── formatters.js          # Output formatting helpers
```

---

## Demo Workflow

**1. Paste transcript.** The reviewer pastes a raw supervisor session transcript into the input panel. No preprocessing required — the system accepts free-form text.

**2. Submit for analysis.** A POST request is sent to `/api/analyze`. The backend assembles the prompt from the Jinja2 template, injects the Pydantic JSON schema, and sends the request to Ollama.

**3. Local inference.** phi3:mini processes the prompt entirely on-device. Response time depends on hardware; on a mid-range laptop without GPU, typical inference time for a short transcript is 15–45 seconds.

**4. Parse and validate.** The raw model output passes through JSON extraction, schema validation, and the guardrail pipeline. Evidence quotes are cross-referenced against the original transcript. KPIs are checked against the allowlist. Confidence is computed deterministically.

**5. Dashboard render.** The validated `AnalyzeResponse` is deserialized on the frontend and distributed across purpose-specific display components. The reviewer sees: overall score with reasoning, identified strengths and weaknesses, verbatim evidence quotes, coverage gaps, KPI tags, confidence indicator, and generated follow-up questions.

**6. Human review.** The reviewer uses the structured output as an analytical scaffold — inspecting evidence, noting gaps, and deciding which follow-up questions to bring to the next session. The AI output is a starting point for professional judgment, not a substitute for it.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Submit a transcript for analysis. Returns `AnalyzeResponse`. |
| `GET` | `/api/health` | Check Ollama connectivity and model availability. |
| `POST` | `/api/retry` | Re-analyze a transcript with escalated prompt strictness. |

**`POST /api/analyze` — Request body**

```json
{
  "transcript": "string (required)"
}
```

**`AnalyzeResponse` — Success**

```json
{
  "success": true,
  "data": {
    "score": 7,
    "summary": "string",
    "strengths": ["string"],
    "weaknesses": ["string"],
    "evidence": ["verbatim quote from transcript"],
    "gaps": ["evaluation dimension not addressed"],
    "questions": ["follow-up question"],
    "reasoning": "string",
    "confidence": "High | Moderate | Low"
  },
  "processing_time_ms": 18432
}
```

---

## Setup & Installation

### Prerequisites

- [Ollama](https://ollama.com/) installed and running
- `phi3:mini` model pulled: `ollama pull phi3:mini`
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`. The Vite dev proxy routes `/api` requests to the backend automatically.

---

## Screenshots

> _Add screenshots here after deployment._

**Transcript Input**
```
[screenshot: transcript-input.png]
```

**Analysis Dashboard — Score & Summary**
```
[screenshot: dashboard-score.png]
```

**Evidence Panel — Verbatim Quote Verification**
```
[screenshot: evidence-panel.png]
```

**Gap Analysis — Coverage Overview**
```
[screenshot: gap-analysis.png]
```

**Confidence Badge & KPI Tags**
```
[screenshot: confidence-kpi.png]
```

---

## Demo Video

> _Link to walkthrough video here._

```
[Demo video: trinethra-demo.mp4 or YouTube link]
Duration: ~3 min
Covers: Transcript input → inference → dashboard review → evidence inspection
```

---

## Future Improvements

**Streaming inference.** Incremental token streaming from Ollama would allow the dashboard to populate progressively rather than waiting for the full response. This would significantly improve perceived responsiveness on low-RAM hardware where inference latency is highest.

**Transcript file upload.** Support for `.txt` and `.pdf` transcript uploads would remove the manual copy-paste step and enable batch processing workflows for program coordinators reviewing multiple sessions.

**Semantic evidence matching.** The current guardrail checks for exact substring presence. Replacing this with a lightweight semantic similarity check (e.g., sentence embeddings) would reduce false negatives from minor paraphrasing while maintaining grounding requirements.

**Lightweight response caching.** A cache keyed on transcript hash would avoid redundant inference runs when the same transcript is submitted multiple times — useful in review workflows where coordinators re-examine the same session.

**Expanded model support.** The prompt and schema design is intentionally model-agnostic. Formal testing against `llama3.2:3b`, `mistral:7b`, and `gemma2:2b` would allow users on higher-spec hardware to trade latency for reasoning depth.

**Rubric configuration.** The current KPI allowlist and evaluation dimensions are hardcoded. Exposing these as configuration options would allow the system to be adapted to different training program rubrics without code changes.

---

## License

MIT License. See `LICENSE` for details.
