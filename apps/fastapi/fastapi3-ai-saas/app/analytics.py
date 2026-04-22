"""PostHog analytics client."""

import atexit

from posthog import Posthog

from app.config import get_settings


def _create_client() -> Posthog:
    settings = get_settings()
    client = Posthog(
        api_key=settings.posthog_api_key,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = _create_client()
