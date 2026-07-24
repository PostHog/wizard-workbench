"""PostHog client lifecycle management."""

import atexit
from typing import Optional

from posthog import Posthog

from app.config import Settings

posthog_client: Optional[Posthog] = None


def initialize_posthog(settings: Settings) -> Optional[Posthog]:
    """Create the process-wide PostHog client when configured."""
    global posthog_client

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
        settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


def shutdown_posthog() -> None:
    """Flush and close the PostHog client during application shutdown."""
    if posthog_client is not None:
        posthog_client.shutdown()
