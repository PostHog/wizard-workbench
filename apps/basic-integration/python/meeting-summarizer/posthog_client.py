"""Process-wide PostHog client configuration."""

import atexit
import os
from typing import Optional

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _is_debug() -> bool:
    return os.getenv("POSTHOG_DEBUG", "false").lower() == "true"


def _missing_configuration_error(variable_name: str) -> RuntimeError:
    return RuntimeError(
        f"{variable_name} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{variable_name} is configured"
    )


def _create_client() -> Optional[Posthog]:
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    for variable_name, value in (
        ("POSTHOG_PROJECT_TOKEN", project_token),
        ("POSTHOG_HOST", host),
    ):
        if value:
            continue
        if _is_debug():
            raise _missing_configuration_error(variable_name)
        return None

    return Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )


posthog_client = _create_client()


def shutdown() -> None:
    """Flush queued events when the process exits."""
    if posthog_client:
        posthog_client.shutdown()


atexit.register(shutdown)
