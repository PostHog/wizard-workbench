"""PostHog client lifecycle and shared access point."""

import atexit

from posthog import Posthog

from app.config import get_settings

posthog_client: Posthog | None = None


def init_posthog() -> Posthog | None:
    """Create the process-wide PostHog client when configuration is available."""
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
        return None

    posthog_client = Posthog(
        project_api_key=settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    return posthog_client


def shutdown_posthog() -> None:
    """Flush and close the shared PostHog client."""
    if posthog_client is not None:
        posthog_client.shutdown()


atexit.register(shutdown_posthog)
