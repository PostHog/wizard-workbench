"""PostHog client initialization for the Django application."""

import atexit

from django.conf import settings
from posthog import Posthog

posthog_client = None


def initialize_posthog():
    """Create the process-wide PostHog client when it is configured."""
    global posthog_client

    if not settings.POSTHOG_PROJECT_TOKEN:
        if settings.DEBUG:
            raise RuntimeError(
                "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
                "un-configured, this causes events to be silently missed. This error "
                "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
            )
        return

    if not settings.POSTHOG_HOST:
        if settings.DEBUG:
            raise RuntimeError(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing "
                "once POSTHOG_HOST is configured"
            )
        return

    posthog_client = Posthog(
        project_api_key=settings.POSTHOG_PROJECT_TOKEN,
        host=settings.POSTHOG_HOST,
        enable_exception_autocapture=True,
    )
    settings.POSTHOG_MW_CLIENT = posthog_client
    atexit.register(posthog_client.shutdown)
