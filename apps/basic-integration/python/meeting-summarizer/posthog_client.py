"""Process-wide PostHog client configuration."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _missing_configuration_error(variable_name: str) -> RuntimeError:
    """Explain why local analytics configuration is required."""
    return RuntimeError(
        f"{variable_name} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{variable_name} is configured"
    )


def _is_production() -> bool:
    """Keep production boot resilient when optional analytics is unconfigured."""
    return os.getenv("ENVIRONMENT", "development").lower() == "production"


def _initialize_posthog() -> Posthog | None:
    """Create the process-wide PostHog client when configuration is present."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    if not project_token:
        if _is_production():
            return None
        raise _missing_configuration_error("POSTHOG_PROJECT_TOKEN")

    if not host:
        if _is_production():
            return None
        raise _missing_configuration_error("POSTHOG_HOST")

    return Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )


posthog_client = _initialize_posthog()

if posthog_client:
    atexit.register(posthog_client.shutdown)
