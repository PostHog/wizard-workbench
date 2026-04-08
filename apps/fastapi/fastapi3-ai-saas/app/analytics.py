"""PostHog analytics client."""

import atexit

from posthog import Posthog

from app.config import get_settings

_settings = get_settings()

posthog_client = Posthog(
    project_api_key=_settings.posthog_api_key,
    host=_settings.posthog_host,
    enable_exception_autocapture=True,
)
atexit.register(posthog_client.shutdown)
