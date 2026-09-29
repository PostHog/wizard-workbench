"""Process-wide PostHog client configuration."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _missing_configuration(variable_name: str) -> None:
    """Raise locally while allowing unconfigured production deployments to run."""
    if os.getenv("ENVIRONMENT", "development").lower() != "production":
        raise RuntimeError(
            f"{variable_name} variable required by PostHog is missing or un-configured, "
            f"this causes events to be silently missed. This error stops appearing once "
            f"{variable_name} is configured"
        )


def _create_posthog_client() -> Posthog | None:
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    if not project_token:
        _missing_configuration("POSTHOG_PROJECT_TOKEN")
        return None

    host = os.getenv("POSTHOG_HOST")
    if not host:
        _missing_configuration("POSTHOG_HOST")
        return None

    return Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )


posthog_client = _create_posthog_client()

if posthog_client:
    atexit.register(posthog_client.shutdown)
