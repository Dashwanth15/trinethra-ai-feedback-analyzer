from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router

app = FastAPI(
    title="Trinethra — Supervisor Feedback Analyzer",
    description="AI-powered supervisor feedback analysis with hallucination guardrails",
    version="1.0.0",
)

# CORS for local development (Vite default port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api", tags=["analysis"])


@app.get("/")
async def root() -> dict:
    return {"message": "Trinethra API is running", "docs": "/docs"}
