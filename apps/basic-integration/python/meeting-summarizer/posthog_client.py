"""Process-wide PostHog client for the meeting summarizer."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog


load_dotenv()
posthog_client = None
_project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
_host = os.getenv("POSTHOG_HOST")
_is_production = os.getenv("ENVIRONMENT", "development").lower() == "production"

if _project_token and _host:
    posthog_client = Posthog(
        _project_token,
        host=_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
elif not _is_production:
    missing = "POSTHOG_PROJECT_TOKEN" if not _project_token else "POSTHOG_HOST"
    raise RuntimeError(
        f"{missing} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing "
        f"once {missing} is configured"
    )
