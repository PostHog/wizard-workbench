"""Process-level PostHog client configuration for Django."""

import atexit
import os
from typing import Optional

from posthog import Posthog


POSTHOG_PROJECT_API_KEY = os.environ.get("POSTHOG_PROJECT_API_KEY")
POSTHOG_HOST = os.environ.get("POSTHOG_HOST")
DEBUG = os.environ.get("DEBUG", "True").lower() in ("true", "1", "yes")


def _missing_configuration_error(variable_name: str) -> RuntimeError:
    return RuntimeError(
        f"{variable_name} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{variable_name} is configured"
    )


if not POSTHOG_PROJECT_API_KEY:
    if DEBUG:
        raise _missing_configuration_error("POSTHOG_PROJECT_API_KEY")
    posthog_client: Optional[Posthog] = None
elif not POSTHOG_HOST:
    if DEBUG:
        raise _missing_configuration_error("POSTHOG_HOST")
    posthog_client = None
else:
    posthog_client = Posthog(
        project_api_key=POSTHOG_PROJECT_API_KEY,
        host=POSTHOG_HOST,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
