"""PostHog client shared by Django's request middleware and application code."""

import atexit

from django.conf import settings
from posthog import Posthog


posthog_client = Posthog(
    project_api_key=settings.POSTHOG_API_KEY,
    host=settings.POSTHOG_HOST,
    enable_exception_autocapture=True,
)

atexit.register(posthog_client.shutdown)
