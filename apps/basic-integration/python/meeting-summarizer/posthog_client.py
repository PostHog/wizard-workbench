"""Process-wide PostHog client configuration."""

import atexit
import logging
import os
from typing import Optional

from posthog import Posthog


def _warn_if_unconfigured(variable_name: str) -> None:
    """Warn in non-production when analytics configuration is missing."""
    if os.getenv("APP_ENV") != "production":
        logging.warning(
            "%s variable required by PostHog is missing or un-configured, "
            "this causes events to be silently missed. This error stops "
            "appearing once %s is configured",
            variable_name,
            variable_name,
        )


def initialize_posthog() -> Optional[Posthog]:
    """Create the shared PostHog client, or no-op when it is unconfigured."""
    api_key = os.getenv("POSTHOG_API_KEY")
    host = os.getenv("POSTHOG_HOST")

    if not api_key:
        _warn_if_unconfigured("POSTHOG_API_KEY")
        return None

    if not host:
        _warn_if_unconfigured("POSTHOG_HOST")
        return None

    client = Posthog(
        api_key,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = initialize_posthog()
