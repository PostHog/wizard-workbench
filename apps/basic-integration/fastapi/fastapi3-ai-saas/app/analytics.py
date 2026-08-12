"""Shared PostHog client lifecycle management."""

import atexit
from typing import Optional

from posthog import Posthog

from app.config import Settings

posthog_client: Optional[Posthog] = None


def initialize_posthog(settings: Settings) -> Optional[Posthog]:
    """Create the process-wide PostHog client when it is configured."""
    global posthog_client

    if posthog_client is not None:
        return posthog_client

    missing_variable = next(
        (
            variable
            for variable, value in (
                ("POSTHOG_PROJECT_TOKEN", settings.posthog_project_token),
                ("POSTHOG_HOST", settings.posthog_host),
            )
            if not value
        ),
        None,
    )
    if missing_variable:
        if settings.debug:
            raise RuntimeError(
                f"{missing_variable} variable required by PostHog is missing or "
                f"un-configured, this causes events to be silently missed. This "
                f"error stops appearing once {missing_variable} is configured"
            )
        return None

    posthog_client = Posthog(
        settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


def get_posthog_client() -> Optional[Posthog]:
    """Return the process-wide PostHog client after lifespan initialization."""
    return posthog_client
