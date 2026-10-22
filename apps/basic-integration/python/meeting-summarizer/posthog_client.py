"""Process-wide PostHog client for server-side analytics."""

import atexit
import os
from typing import Optional

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _posthog_debug_enabled() -> bool:
    """Return whether missing PostHog configuration should stop startup."""
    return os.getenv("POSTHOG_DEBUG", "").lower() in {"1", "true", "yes"}


def _missing_configuration_error(variable_name: str) -> RuntimeError:
    return RuntimeError(
        f"{variable_name} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{variable_name} is configured"
    )


def _initialize_posthog() -> Optional[Posthog]:
    """Construct the one PostHog client for this server process."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    if not project_token:
        if _posthog_debug_enabled():
            raise _missing_configuration_error("POSTHOG_PROJECT_TOKEN")
        return None

    if not host:
        if _posthog_debug_enabled():
            raise _missing_configuration_error("POSTHOG_HOST")
        return None

    client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = _initialize_posthog()
