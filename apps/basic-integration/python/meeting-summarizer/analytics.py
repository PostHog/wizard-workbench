"""Shared PostHog analytics client for the AI Meeting Summarizer."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _initialize_posthog():
    """Initialize the PostHog client from environment variables."""
    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')

    if not project_token:
        import logging
        logging.warning("PostHog not configured (POSTHOG_PROJECT_TOKEN not set). Analytics will not be tracked.")
        return None

    client = Posthog(
        project_token,
        host=os.getenv('POSTHOG_HOST'),
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = _initialize_posthog()
