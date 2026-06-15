"""PostHog analytics client initialization."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()

_client = None


def get_posthog() -> Posthog | None:
    """Return a shared PostHog instance, or None if not configured."""
    global _client
    if _client is not None:
        return _client

    token = os.getenv('POSTHOG_PROJECT_TOKEN')
    host = os.getenv('POSTHOG_HOST')
    if not token or not host:
        return None

    _client = Posthog(
        token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(_client.shutdown)
    return _client
