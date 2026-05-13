from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    OLLAMA_URL: str = "http://localhost:11434"
    MODEL: str = "phi3:mini"
    MAX_RETRIES: int = 0          # No retries — single shot for speed
    REQUEST_TIMEOUT: int = 120    # 2 min generous window for CPU inference
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"


settings = Settings()
