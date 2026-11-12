"""Shared PostHog client for the meeting summarizer server."""

import atexit
import logging
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()

_logger = logging.getLogger(__name__)
_is_production = os.getenv("ENVIRONMENT", "development").lower() in {"production", "prod"}
_project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
_host = os.getenv("POSTHOG_HOST")

posthog_client = None
if _project_token and _host:
    posthog_client = Posthog(
        _project_token,
        host=_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
elif not _is_production:
    for variable in ("POSTHOG_PROJECT_TOKEN", "POSTHOG_HOST"):
        if not os.getenv(variable):
            _logger.warning(
                "%s variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops "
                "appearing once %s is configured",
                variable,
                variable,
            )
