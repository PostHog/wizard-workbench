"""Process-wide PostHog client initialization for the meeting summarizer."""

import atexit
import os

from posthog import Posthog


def _initialize_posthog():
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    is_development = os.getenv("POSTHOG_ENV", "production").lower() in {
        "development",
        "dev",
        "debug",
    }

    if not project_token:
        if is_development:
            raise RuntimeError(
                "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
                "un-configured, this causes events to be silently missed. This error "
                "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
            )
        return None

    if not host:
        if is_development:
            raise RuntimeError(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing "
                "once POSTHOG_HOST is configured"
            )
        return None

    client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = _initialize_posthog()
