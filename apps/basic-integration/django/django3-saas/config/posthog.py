"""Process-wide PostHog client for Django request instrumentation."""

import atexit
import os

from posthog import Posthog


posthog_client = Posthog(
    project_api_key=os.environ['POSTHOG_PROJECT_TOKEN'],
    host=os.environ['POSTHOG_HOST'],
    enable_exception_autocapture=True,
)

atexit.register(posthog_client.shutdown)
