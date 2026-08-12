"""PostHog client lifecycle management."""

import atexit

from posthog import Posthog

from app.config import Settings

posthog_client: Posthog | None = None


def configure_posthog(settings: Settings) -> None:
    """Create the process-wide PostHog client during application startup."""
    global posthog_client

    if not settings.posthog_project_token:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
                "un-configured, this causes events to be silently missed. This error "
                "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
            )
        return

    if not settings.posthog_host:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing "
                "once POSTHOG_HOST is configured"
            )
        return

    posthog_client = Posthog(
        project_api_key=settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)


def get_posthog_client() -> Posthog | None:
    """Return the application-wide PostHog client, if configured."""
    return posthog_client


def shutdown_posthog() -> None:
    """Flush PostHog events when the application stops."""
    global posthog_client

    if posthog_client:
        posthog_client.shutdown()
        posthog_client = None
