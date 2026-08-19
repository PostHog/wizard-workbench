"""Process-wide PostHog client lifecycle helpers."""

import atexit

from posthog import Posthog

from app.config import Settings

posthog_client: Posthog | None = None


def initialize_posthog(settings: Settings) -> None:
    """Create the PostHog client once when the application starts."""
    global posthog_client

    if not settings.posthog_project_token or not settings.posthog_host:
        if settings.debug:
            missing_var = (
                "POSTHOG_PROJECT_TOKEN"
                if not settings.posthog_project_token
                else "POSTHOG_HOST"
            )
            raise RuntimeError(
                f"{missing_var} variable required by PostHog is missing or un-configured, "
                f"this causes events to be silently missed. This error stops appearing "
                f"once {missing_var} is configured"
            )
        return

    posthog_client = Posthog(
        settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)


def get_posthog_client() -> Posthog | None:
    """Return the initialized PostHog client, if analytics is configured."""
    return posthog_client


def shutdown_posthog() -> None:
    """Flush and close the PostHog client when the application stops."""
    if posthog_client is not None:
        posthog_client.shutdown()
