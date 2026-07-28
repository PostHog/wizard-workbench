"""Process-wide PostHog client for the meeting summarizer."""

import atexit
import logging
import os
from typing import Optional

from dotenv import load_dotenv
from posthog import Posthog


load_dotenv()


logger = logging.getLogger(__name__)


def _is_production() -> bool:
    return os.getenv("ENVIRONMENT", os.getenv("FLASK_ENV", "")).lower() == "production"


def _required_config(name: str) -> Optional[str]:
    value = os.getenv(name)
    if value:
        return value

    message = (
        f"{name} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once {name} is configured"
    )
    if _is_production():
        logger.warning(message)
        return None
    raise RuntimeError(message)


def initialize_posthog() -> Optional[Posthog]:
    """Create the process-wide PostHog client, or disable analytics in production."""
    project_token = _required_config("POSTHOG_PROJECT_TOKEN")
    host = _required_config("POSTHOG_HOST")
    if not project_token or not host:
        return None

    client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = initialize_posthog()
