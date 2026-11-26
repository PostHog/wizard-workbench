"""Process-wide PostHog client for server-side analytics."""

import atexit
import logging
import os
from typing import Optional

from posthog import Posthog


posthog_client: Optional[Posthog] = None


def _is_production() -> bool:
    return os.getenv("APP_ENV", os.getenv("ENVIRONMENT", "")).lower() == "production"


def initialize_posthog() -> Optional[Posthog]:
    """Create the shared PostHog client once, when analytics is configured."""
    global posthog_client

    if posthog_client is not None:
        return posthog_client

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    if not project_token or not host:
        if not _is_production():
            missing_variable = "POSTHOG_PROJECT_TOKEN" if not project_token else "POSTHOG_HOST"
            logging.warning(
                "%s variable required by PostHog is missing or un-configured, this causes "
                "events to be silently missed. This error stops appearing once %s is configured",
                missing_variable,
                missing_variable,
            )
        return None

    posthog_client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


def get_posthog_client() -> Optional[Posthog]:
    """Return the server's shared PostHog client, if initialized."""
    return posthog_client
