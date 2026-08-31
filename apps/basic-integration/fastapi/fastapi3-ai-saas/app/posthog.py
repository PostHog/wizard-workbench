"""Shared PostHog client for the FastAPI application."""

import atexit

from posthog import Posthog

from app.config import Settings

posthog_client: Posthog | None = None


def initialize_posthog(settings: Settings) -> Posthog | None:
    """Create the process-wide PostHog client when it is configured."""
    global posthog_client

    if not settings.posthog_project_token or not settings.posthog_host:
        if settings.debug:
            missing_variable = (
                "POSTHOG_PROJECT_TOKEN"
                if not settings.posthog_project_token
                else "POSTHOG_HOST"
            )
            raise RuntimeError(
                f"{missing_variable} variable required by PostHog is missing or "
                f"un-configured, this causes events to be silently missed. This error "
                f"stops appearing once {missing_variable} is configured"
            )
        return None

    posthog_client = Posthog(
        settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


def get_posthog_client() -> Posthog | None:
    """Return the process-wide PostHog client initialized during app startup."""
    return posthog_client
