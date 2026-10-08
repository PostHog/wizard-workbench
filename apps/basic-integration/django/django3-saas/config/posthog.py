"""Shared PostHog client initialized during Django startup."""

import atexit
from typing import Optional

from posthog import Posthog

posthog_client: Optional[Posthog] = None


def initialize_posthog(api_key: str, host: str) -> Posthog:
    """Create the process-wide PostHog client and flush it at process exit."""
    global posthog_client

    posthog_client = Posthog(
        api_key,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


def get_posthog_client() -> Optional[Posthog]:
    """Return the configured PostHog client, if analytics is enabled."""
    return posthog_client
