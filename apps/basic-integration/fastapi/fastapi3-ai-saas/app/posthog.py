"""PostHog client lifecycle management for the FastAPI application."""

import atexit

from posthog import Posthog

from app.config import Settings

_posthog_client: Posthog | None = None


def initialize_posthog(settings: Settings) -> Posthog | None:
    """Create the process-wide PostHog client when configuration is available."""
    global _posthog_client

    if _posthog_client is not None:
        return _posthog_client

    if not settings.posthog_project_token:
        _raise_for_missing_configuration("POSTHOG_PROJECT_TOKEN", settings.debug)
        return None

    if not settings.posthog_host:
        _raise_for_missing_configuration("POSTHOG_HOST", settings.debug)
        return None

    _posthog_client = Posthog(
        project_api_key=settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(_posthog_client.shutdown)
    return _posthog_client


def get_posthog_client() -> Posthog | None:
    """Return the process-wide PostHog client initialized during app startup."""
    return _posthog_client


def shutdown_posthog() -> None:
    """Flush queued events before the application exits."""
    if _posthog_client is not None:
        _posthog_client.flush()
        _posthog_client.shutdown()


def _raise_for_missing_configuration(variable_name: str, debug: bool) -> None:
    if debug:
        raise RuntimeError(
            f"{variable_name} variable required by PostHog is missing or un-configured, "
            f"this causes events to be silently missed. This error stops appearing once "
            f"{variable_name} is configured"
        )
