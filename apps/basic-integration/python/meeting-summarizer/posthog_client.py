"""Shared PostHog client for analytics event tracking."""

import atexit
import os

from posthog import Posthog

posthog_client = Posthog(
    project_api_key=os.environ.get("POSTHOG_API_KEY", ""),
    host=os.environ.get("POSTHOG_HOST", ""),
    enable_exception_autocapture=True,
)

atexit.register(posthog_client.shutdown)
