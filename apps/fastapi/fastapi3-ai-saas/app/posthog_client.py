"""PostHog analytics client."""

import atexit
from typing import Optional

from posthog import Posthog

from app.config import get_settings

_posthog: Optional[Posthog] = None


def get_posthog() -> Posthog:
    """Return the initialized PostHog client."""
    global _posthog
    if _posthog is None:
        raise RuntimeError("PostHog client has not been initialized. Call init_posthog() first.")
    return _posthog


def init_posthog() -> Posthog:
    """Initialize the PostHog client using application settings."""
    global _posthog
    settings = get_settings()
    _posthog = Posthog(
        api_key=settings.posthog_api_key,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(_posthog.shutdown)
    return _posthog


def shutdown_posthog() -> None:
    """Flush and shut down the PostHog client."""
    global _posthog
    if _posthog is not None:
        _posthog.shutdown()
