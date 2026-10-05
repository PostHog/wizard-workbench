"""Process-wide PostHog client configuration."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def initialize_posthog():
    """Create the shared PostHog client when analytics is configured."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    for variable_name, value in (
        ("POSTHOG_PROJECT_TOKEN", project_token),
        ("POSTHOG_HOST", host),
    ):
        if not value:
            if os.getenv("POSTHOG_DEBUG", "").lower() == "true":
                raise RuntimeError(
                    f"{variable_name} variable required by PostHog is missing or "
                    "un-configured, this causes events to be silently missed. This "
                    f"error stops appearing once {variable_name} is configured"
                )
            return None

    client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = initialize_posthog()
