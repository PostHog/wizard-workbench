"""PostHog analytics client initialization."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()

_posthog_client = None


def get_posthog():
    """Return the shared PostHog instance, initializing it on first call."""
    global _posthog_client
    if _posthog_client is None:
        api_key = os.getenv('POSTHOG_API_KEY')
        if api_key:
            _posthog_client = Posthog(
                api_key,
                host=os.getenv('POSTHOG_HOST'),
                enable_exception_autocapture=True,
            )
            atexit.register(_posthog_client.shutdown)
    return _posthog_client
