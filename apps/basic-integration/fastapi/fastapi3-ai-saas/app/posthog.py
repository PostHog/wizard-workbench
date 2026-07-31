"""PostHog client lifecycle for the application."""

import atexit

from posthog import Posthog

from app.config import get_settings


posthog_client: Posthog | None = None


def initialize_posthog() -> None:
    """Initialize the PostHog client during application startup."""
    global posthog_client

    if posthog_client is not None:
        return

    settings = get_settings()
    if not settings.posthog_project_token:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing once "
                "POSTHOG_PROJECT_TOKEN is configured"
            )
        return
    if not settings.posthog_host:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing once "
                "POSTHOG_HOST is configured"
            )
        return

    posthog_client = Posthog(
        settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)


def shutdown_posthog() -> None:
    """Flush and shut down the configured PostHog client."""
    global posthog_client

    if posthog_client is not None:
        posthog_client.shutdown()
        posthog_client = None
