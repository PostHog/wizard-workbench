"""Lifecycle-managed PostHog client access."""

import atexit

from posthog import Posthog

_posthog_client: Posthog | None = None


def initialize_posthog(project_token: str, host: str) -> None:
    """Create the process-wide PostHog client during FastAPI startup."""
    global _posthog_client
    _posthog_client = Posthog(
        project_api_key=project_token,
        host=host,
        enable_exception_autocapture=True,
    )


def get_posthog_client() -> Posthog | None:
    """Return the lifecycle-managed client, if PostHog is configured."""
    return _posthog_client


def shutdown_posthog() -> None:
    """Flush and shut down the PostHog client when the process exits."""
    if _posthog_client is not None:
        _posthog_client.shutdown()


atexit.register(shutdown_posthog)
