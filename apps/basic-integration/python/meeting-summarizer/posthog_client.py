"""Process-wide PostHog client for the meeting summarizer."""

import atexit
import logging
import os

from dotenv import load_dotenv
from posthog import Posthog


load_dotenv()


_REQUIRED_MESSAGE = (
    "{variable} variable required by PostHog is missing or un-configured, "
    "this causes events to be silently missed. This error stops appearing "
    "once {variable} is configured"
)


def initialize_posthog():
    """Create one PostHog client, or safely disable analytics in production."""
    token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    debug = os.getenv("DEBUG", "").lower() in {"1", "true", "yes"}

    missing = "POSTHOG_PROJECT_TOKEN" if not token else None
    if not missing and not host:
        missing = "POSTHOG_HOST"
    if missing:
        if debug:
            raise RuntimeError(_REQUIRED_MESSAGE.format(variable=missing))
        return None

    client = Posthog(
        token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = initialize_posthog()

if posthog_client is None:
    logging.info("PostHog analytics disabled because configuration is unavailable")
