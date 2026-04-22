"""Shared PostHog analytics client for the AI Meeting Summarizer."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()

_client = None


def get_posthog_client():
    """Return the shared PostHog client instance, initializing it if needed."""
    global _client

    if _client is not None:
        return _client

    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')

    if not project_token:
        return None

    _client = Posthog(
        project_token,
        host=os.getenv('POSTHOG_HOST'),
        enable_exception_autocapture=True,
    )

    atexit.register(_client.shutdown)

    return _client
