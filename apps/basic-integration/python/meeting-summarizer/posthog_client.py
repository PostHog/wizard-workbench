"""Process-wide PostHog client configuration."""

import atexit
import logging
import os

from dotenv import load_dotenv
from posthog import Posthog


load_dotenv()

posthog_client = None


def initialize_posthog():
    """Create and return the process-wide PostHog client when configured."""
    global posthog_client

    if posthog_client is not None:
        return posthog_client

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    if not project_token or not host:
        if os.getenv("ENVIRONMENT", "development").lower() != "production":
            missing_variable = (
                "POSTHOG_PROJECT_TOKEN" if not project_token else "POSTHOG_HOST"
            )
            logging.warning(
                "%s variable required by PostHog is missing or un-configured, this "
                "causes events to be silently missed. This error stops appearing "
                "once %s is configured",
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


def get_posthog_client():
    """Return the process-wide PostHog client, or None when not configured."""
    return posthog_client
