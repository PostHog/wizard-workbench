"""PostHog client configuration for server-side analytics."""

import atexit

from posthog import Posthog

from app.config import get_settings

settings = get_settings()

posthog_client = Posthog(
    settings.posthog_project_token,
    host=settings.posthog_host,
    enable_exception_autocapture=True,
)

atexit.register(posthog_client.shutdown)
