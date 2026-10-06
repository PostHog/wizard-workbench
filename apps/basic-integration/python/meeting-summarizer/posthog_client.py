"""Process-wide PostHog client configuration."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _is_development() -> bool:
    return os.getenv("ENVIRONMENT", "development").lower() in {
        "development",
        "dev",
        "debug",
    }


def _required_setting(name: str) -> str | None:
    value = os.getenv(name)
    if value:
        return value

    if _is_development():
        raise RuntimeError(
            f"{name} variable required by PostHog is missing or un-configured, "
            f"this causes events to be silently missed. This error stops appearing "
            f"once {name} is configured"
        )

    return None


def _initialize_posthog() -> Posthog | None:
    """Create the singleton client, or no-op when production config is absent."""
    project_token = _required_setting("POSTHOG_PROJECT_TOKEN")
    host = _required_setting("POSTHOG_HOST")

    if not project_token or not host:
        return None

    return Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )


posthog_client = _initialize_posthog()

if posthog_client:
    atexit.register(posthog_client.shutdown)
