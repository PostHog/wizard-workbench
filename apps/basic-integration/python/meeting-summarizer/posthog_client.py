"""Process-wide PostHog client configuration."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _is_development() -> bool:
    """Return whether missing analytics configuration should stop startup."""
    return os.getenv("ENVIRONMENT", "").lower() in {"development", "dev"} or (
        os.getenv("DEBUG", "").lower() == "true"
    )


def _configuration_error(variable_name: str) -> RuntimeError:
    return RuntimeError(
        f"{variable_name} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{variable_name} is configured"
    )


def _create_posthog_client() -> Posthog | None:
    """Create the single client for this server process when configured."""
    project_token = os.getenv("POSTHOG_API_KEY")
    host = os.getenv("POSTHOG_HOST")

    if not project_token:
        if _is_development():
            raise _configuration_error("POSTHOG_API_KEY")
        return None

    if not host:
        if _is_development():
            raise _configuration_error("POSTHOG_HOST")
        return None

    return Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )


posthog_client = _create_posthog_client()

if posthog_client:
    atexit.register(posthog_client.shutdown)
