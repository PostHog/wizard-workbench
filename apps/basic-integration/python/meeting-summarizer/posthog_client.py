"""PostHog analytics client initialization."""

import atexit
import logging
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _initialize_posthog():
    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')
    if not project_token:
        logging.warning("PostHog not configured (POSTHOG_PROJECT_TOKEN not set) — analytics disabled")
        return None

    client = Posthog(
        project_token,
        host=os.getenv('POSTHOG_HOST', 'https://us.i.posthog.com'),
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = _initialize_posthog()
