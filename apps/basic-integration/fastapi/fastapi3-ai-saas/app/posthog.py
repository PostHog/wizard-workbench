"""Shared PostHog client configuration for the FastAPI application."""

import atexit

from posthog import Posthog

from app.config import Settings

posthog_client: Posthog | None = None


def initialize_posthog(settings: Settings) -> Posthog | None:
    """Create the process-wide PostHog client when it is configured."""
    global posthog_client

    if not settings.posthog_project_token:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
                "un-configured, this causes events to be silently missed. This error "
                "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
            )
        return None

    if not settings.posthog_host:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing "
                "once POSTHOG_HOST is configured"
            )
        return None

    posthog_client = Posthog(
        project_api_key=settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


def get_posthog_client() -> Posthog | None:
    """Return the process-wide PostHog client after lifespan initialization."""
    return posthog_client
