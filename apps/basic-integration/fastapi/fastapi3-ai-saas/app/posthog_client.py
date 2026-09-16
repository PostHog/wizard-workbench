"""Shared PostHog client lifecycle helpers."""

import atexit

from posthog import Posthog

from app.config import Settings

posthog_client: Posthog | None = None


def initialize_posthog(settings: Settings) -> None:
    """Create the process-wide PostHog client when configuration is available."""
    global posthog_client

    if posthog_client is not None:
        return

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


def get_posthog_client() -> Posthog | None:
    """Return the initialized process-wide PostHog client, if configured."""
    return posthog_client


def flush_posthog() -> None:
    """Flush queued events during FastAPI lifespan shutdown."""
    if posthog_client is not None:
        posthog_client.flush()


def shutdown_posthog() -> None:
    """Shut down the client when the process exits."""
    if posthog_client is not None:
        posthog_client.shutdown()


atexit.register(shutdown_posthog)
