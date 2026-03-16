"""PostHog analytics client initialization."""

import os
from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def initialize_posthog():
    """Initialize PostHog with instance-based API.

    Returns PostHog instance or None if project token not configured.
    """
    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')

    if not project_token:
        return None

    host = os.getenv('POSTHOG_HOST')
    if not host:
        return None

    return Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )


posthog_client = initialize_posthog()
