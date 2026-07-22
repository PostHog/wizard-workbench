"""Application configuration using Pydantic Settings."""

from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    app_name: str = "Acme AI"
    debug: bool = True

    # Database
    database_url: str = "sqlite:///./acme.db"

    # Security
    secret_key: str = "dev-secret-key-change-in-production"

    # Session
    session_cookie_name: str = "session_token"
    session_max_age: int = 86400 * 7  # 7 days

    # Credits
    default_credits: int = 100

    # PostHog (optional; configured in the application lifespan)
    posthog_project_token: str | None = None
    posthog_host: str | None = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
