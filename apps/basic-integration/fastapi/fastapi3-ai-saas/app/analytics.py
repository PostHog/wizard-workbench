"""PostHog analytics client."""

import atexit

from posthog import Posthog

from app.config import get_settings

_settings = get_settings()

posthog_client = Posthog(
    _settings.posthog_project_token,
    host=_settings.posthog_host,
    enable_exception_autocapture=True,
    disabled=_settings.posthog_disabled,
)
atexit.register(posthog_client.shutdown)
