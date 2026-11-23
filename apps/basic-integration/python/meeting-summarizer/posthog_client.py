"""Process-wide PostHog client for server-side analytics."""

import atexit
import logging
import os

from posthog import Posthog


logger = logging.getLogger(__name__)


def _is_production() -> bool:
    """Return whether the application is running in production."""
    return os.getenv("ENVIRONMENT", "").lower() == "production"


def _create_posthog_client():
    """Create the shared PostHog client when its environment is configured."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    if not project_token:
        if not _is_production():
            logger.warning(
                "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
                "un-configured, this causes events to be silently missed. This error "
                "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
            )
        return None

    if not host:
        if not _is_production():
            logger.warning(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing "
                "once POSTHOG_HOST is configured"
            )
        return None

    return Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )


posthog_client = _create_posthog_client()

if posthog_client:
    atexit.register(posthog_client.shutdown)
