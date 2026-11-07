"""Process-wide PostHog client configuration."""

import atexit
import logging
import os
from typing import Optional

from dotenv import load_dotenv
from posthog import Posthog


load_dotenv()


def _missing_configuration_warning(variable: str) -> None:
    """Warn outside production when analytics configuration is incomplete."""
    if os.getenv("ENVIRONMENT") != "production":
        logging.warning(
            "%s variable required by PostHog is missing or un-configured, "
            "this causes events to be silently missed. This error stops "
            "appearing once %s is configured",
            variable,
            variable,
        )


def _create_posthog_client() -> Optional[Posthog]:
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    if not project_token:
        _missing_configuration_warning("POSTHOG_PROJECT_TOKEN")
        return None

    if not host:
        _missing_configuration_warning("POSTHOG_HOST")
        return None

    return Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )


posthog_client = _create_posthog_client()

if posthog_client:
    atexit.register(posthog_client.shutdown)
