from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    OLLAMA_URL: str = "http://localhost:11434"
    MODEL: str = "phi3:mini"
    MAX_RETRIES: int = 3
    REQUEST_TIMEOUT: int = 60
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"


settings = Settings()
