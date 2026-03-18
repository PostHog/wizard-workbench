"""PostHog analytics client initialization."""

import atexit
import os
from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def initialize_posthog():
    """Initialize PostHog with instance-based API.

    Returns a Posthog instance, or None if the project token is not configured.
    """
    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')

    if not project_token:
        return None

    client = Posthog(
        project_token,
        host=os.getenv('POSTHOG_HOST'),
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = initialize_posthog()
