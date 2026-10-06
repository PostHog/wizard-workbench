"""Process-wide PostHog client initialization for the FastAPI application."""

import atexit

from posthog import Posthog

from app.config import Settings

posthog_client: Posthog | None = None


def initialize_posthog(settings: Settings) -> Posthog | None:
    """Create and return the process-wide PostHog client when configured."""
    global posthog_client

    if posthog_client is not None:
        return posthog_client

    required_settings = (
        ("POSTHOG_PROJECT_API_KEY", settings.posthog_project_api_key),
        ("POSTHOG_HOST", settings.posthog_host),
    )
    for variable_name, value in required_settings:
        if value:
            continue
        if settings.debug:
            raise RuntimeError(
                f"{variable_name} variable required by PostHog is missing or "
                f"un-configured, this causes events to be silently missed. This "
                f"error stops appearing once {variable_name} is configured"
            )
        return None

    posthog_client = Posthog(
        settings.posthog_project_api_key,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


def get_posthog_client() -> Posthog | None:
    """Return the client initialized by the FastAPI lifespan."""
    return posthog_client
