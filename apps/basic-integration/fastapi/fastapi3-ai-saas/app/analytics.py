"""PostHog client lifecycle and analytics helpers."""

import atexit
from typing import Optional

from posthog import Posthog

from app.config import get_settings

posthog_client: Optional[Posthog] = None


def initialize_posthog() -> Posthog:
    """Create the shared PostHog client at application startup."""
    global posthog_client

    settings = get_settings()
    posthog_client = Posthog(
        settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


def get_posthog_client() -> Posthog:
    """Return the initialized PostHog client."""
    if posthog_client is None:
        raise RuntimeError("PostHog client has not been initialized")
    return posthog_client
