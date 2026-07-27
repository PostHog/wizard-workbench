"""Shared PostHog client for the meeting summarizer server."""

import atexit
import logging
import os

from posthog import Posthog


posthog_client = None


def initialize_posthog():
    """Create one PostHog client for the process when configured."""
    global posthog_client

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    missing = "POSTHOG_PROJECT_TOKEN" if not project_token else "POSTHOG_HOST" if not host else None

    if missing:
        if os.getenv("ENVIRONMENT", "development").lower() not in {"production", "prod"}:
            logging.warning(
                "%s variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing "
                "once %s is configured",
                missing,
                missing,
            )
        return None

    posthog_client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


posthog_client = initialize_posthog()
