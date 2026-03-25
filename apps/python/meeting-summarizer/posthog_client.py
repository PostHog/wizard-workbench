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
    if _posthog_client is not None:
        return _posthog_client

    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')
    if not project_token:
        return None

    _posthog_client = Posthog(
        project_token,
        host=os.getenv('POSTHOG_HOST'),
        enable_exception_autocapture=True,
    )

    atexit.register(_posthog_client.shutdown)
    return _posthog_client
