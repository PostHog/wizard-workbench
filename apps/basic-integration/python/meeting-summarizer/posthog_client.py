"""Process-wide PostHog client for the meeting summarizer."""

import atexit
import logging
import os

from posthog import Posthog

posthog = None


def initialize_posthog():
    """Create and return the shared PostHog client when configured."""
    global posthog

    if posthog is not None:
        return posthog

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    if not project_token or not host:
        missing_variable = "POSTHOG_PROJECT_TOKEN" if not project_token else "POSTHOG_HOST"
        if os.getenv("ENVIRONMENT", "").lower() != "production":
            logging.getLogger(__name__).warning(
                "%s variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops "
                "appearing once %s is configured",
                missing_variable,
                missing_variable,
            )
        return None

    posthog = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog.shutdown)
    return posthog
