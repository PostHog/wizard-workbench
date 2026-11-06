"""Process-wide PostHog client for server-side analytics."""

import atexit
import logging
import os
from typing import Optional

from dotenv import load_dotenv
from posthog import Posthog


load_dotenv()

POSTHOG_PROJECT_TOKEN = os.getenv("POSTHOG_PROJECT_TOKEN")
POSTHOG_HOST = os.getenv("POSTHOG_HOST")


def initialize_posthog() -> Optional[Posthog]:
    """Create the shared client when analytics is configured."""
    if not POSTHOG_PROJECT_TOKEN or not POSTHOG_HOST:
        if os.getenv("ENVIRONMENT", "development").lower() != "production":
            missing_variable = (
                "POSTHOG_PROJECT_TOKEN"
                if not POSTHOG_PROJECT_TOKEN
                else "POSTHOG_HOST"
            )
            logging.warning(
                "%s variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops "
                "appearing once %s is configured",
                missing_variable,
                missing_variable,
            )
        return None

    client = Posthog(
        POSTHOG_PROJECT_TOKEN,
        host=POSTHOG_HOST,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = initialize_posthog()
