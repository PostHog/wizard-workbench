"""Process-wide PostHog client initialization."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def initialize_posthog():
    """Create one PostHog client, or safely disable analytics in production."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    production = os.getenv("PYTHON_ENV", "development").lower() == "production"

    if not project_token:
        if production:
            return None
        raise RuntimeError(
            "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
            "un-configured, this causes events to be silently missed. This error "
            "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
        )
    if not host:
        if production:
            return None
        raise RuntimeError(
            "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
            "this causes events to be silently missed. This error stops appearing "
            "once POSTHOG_HOST is configured"
        )

    client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = initialize_posthog()
