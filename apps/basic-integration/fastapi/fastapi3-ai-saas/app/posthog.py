"""Process-wide PostHog client lifecycle helpers."""

import atexit
from typing import Optional

from posthog import Posthog

from app.config import Settings

posthog_client: Optional[Posthog] = None


def initialize_posthog(settings: Settings) -> Optional[Posthog]:
    """Initialize the PostHog client once when the application starts."""
    global posthog_client

    if posthog_client is not None:
        return posthog_client

    if not settings.posthog_api_key:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_API_KEY variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing once "
                "POSTHOG_API_KEY is configured"
            )
        return None

    if not settings.posthog_host:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing once "
                "POSTHOG_HOST is configured"
            )
        return None

    posthog_client = Posthog(
        settings.posthog_api_key,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


def shutdown_posthog() -> None:
    """Flush queued PostHog events and shut down the client."""
    if posthog_client is not None:
        posthog_client.shutdown()
