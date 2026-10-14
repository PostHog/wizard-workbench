"""Shared PostHog client for server-side analytics."""

from typing import Optional

from posthog import Posthog

posthog_client: Optional[Posthog] = None


def get_posthog_client() -> Optional[Posthog]:
    """Return the process-wide PostHog client when analytics is configured."""
    return posthog_client
