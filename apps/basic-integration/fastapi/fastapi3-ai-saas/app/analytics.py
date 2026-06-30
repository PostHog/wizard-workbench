"""PostHog analytics client."""

import atexit

from posthog import Posthog

from app.config import get_settings


def _create_posthog_client():
    settings = get_settings()
    if settings.posthog_disabled:
        return None
    client = Posthog(
        settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
        debug=settings.debug,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = _create_posthog_client()
