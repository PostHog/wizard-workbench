"""PostHog client configuration for the FastAPI application."""

import atexit
import logging
from functools import lru_cache

from posthog import Posthog

from app.config import get_settings

logger = logging.getLogger(__name__)


@lru_cache
def get_posthog_client() -> Posthog | None:
    """Return the configured process-wide PostHog client, if available."""
    settings = get_settings()
    missing_variables = [
        variable
        for variable, value in (
            ("POSTHOG_API_KEY", settings.posthog_api_key),
            ("POSTHOG_HOST", settings.posthog_host),
        )
        if not value
    ]

    if missing_variables:
        if settings.debug:
            for variable in missing_variables:
                logger.warning(
                    "%s variable required by PostHog is missing or un-configured, "
                    "this causes events to be silently missed. This error stops "
                    "appearing once %s is configured",
                    variable,
                    variable,
                )
        return None

    client = Posthog(
        settings.posthog_api_key,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client
