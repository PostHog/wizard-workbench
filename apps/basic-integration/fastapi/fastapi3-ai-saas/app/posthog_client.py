"""PostHog client initialization and lifecycle helpers."""

import atexit

from posthog import Posthog

from app.config import get_settings


posthog_client: Posthog | None = None


def capture(event: str, **kwargs) -> None:
    if posthog_client is not None:
        posthog_client.capture(event, **kwargs)


def set(distinct_id: str, properties: dict) -> None:
    if posthog_client is not None:
        posthog_client.set(distinct_id, properties=properties)


def initialize_posthog() -> None:
    """Create the process-wide PostHog client when configured."""
    global posthog_client
    settings = get_settings()
    if not settings.posthog_project_token or not settings.posthog_host:
        if settings.debug:
            missing = (
                "POSTHOG_PROJECT_TOKEN"
                if not settings.posthog_project_token
                else "POSTHOG_HOST"
            )
            raise RuntimeError(
                f"{missing} variable required by PostHog is missing or un-configured, "
                f"this causes events to be silently missed. This error stops appearing "
                f"once {missing} is configured"
            )
        return

    posthog_client = Posthog(
        project_api_key=settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)


def flush_posthog() -> None:
    """Flush queued PostHog events if the client was initialized."""
    if posthog_client is not None:
        posthog_client.flush()
