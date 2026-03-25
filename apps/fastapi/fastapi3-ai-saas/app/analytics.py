"""PostHog analytics client."""

from posthog import Posthog

from app.config import get_settings

settings = get_settings()

posthog_client = Posthog(
    api_key=settings.posthog_key,
    host=settings.posthog_host,
    enable_exception_autocapture=True,
)
