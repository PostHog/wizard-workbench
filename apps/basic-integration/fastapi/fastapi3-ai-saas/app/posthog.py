"""Process-wide PostHog client configuration."""

import atexit
import logging
from typing import Optional

from posthog import Posthog

from app.config import get_settings

logger = logging.getLogger(__name__)
posthog_client: Optional[Posthog] = None


def initialize_posthog() -> Optional[Posthog]:
    """Create the PostHog client once when analytics is configured."""
    global posthog_client

    if posthog_client is not None:
        return posthog_client

    settings = get_settings()
    if not settings.posthog_project_token:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
                "un-configured, this causes events to be silently missed. This error "
                "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
            )
        logger.warning("PostHog is not configured; analytics is disabled.")
        return None

    if not settings.posthog_host:
        if settings.debug:
            raise RuntimeError(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing "
                "once POSTHOG_HOST is configured"
            )
        logger.warning("PostHog is not configured; analytics is disabled.")
        return None

    posthog_client = Posthog(
        project_api_key=settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client
