"""PostHog analytics client initialization."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _initialize():
    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')
    if not project_token:
        return None

    host = os.getenv('POSTHOG_HOST')
    if not host:
        return None

    client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = _initialize()
