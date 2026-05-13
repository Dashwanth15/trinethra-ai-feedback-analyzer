class TrinethraError(Exception):
    """Base exception for the application."""
    pass


class LLMError(TrinethraError):
    """Raised when the LLM call fails or returns unusable output."""
    pass


class JSONParseError(TrinethraError):
    """Raised when JSON extraction/repair fails."""
    pass


class ValidationError(TrinethraError):
    """Raised when output fails schema or guardrail validation."""
    pass


class HallucinationError(ValidationError):
    """Raised when fabricated evidence or unsupported data is detected."""
    pass
