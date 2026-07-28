"""Process-wide PostHog client initialization."""

import atexit

from posthog import Posthog


posthog_client: Posthog | None = None


def initialize_posthog(project_token: str | None, host: str | None, debug: bool) -> Posthog | None:
    """Create the shared PostHog client, or remain a production no-op if unconfigured."""
    global posthog_client

    if not project_token:
        if debug:
            raise RuntimeError(
                "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing once "
                "POSTHOG_PROJECT_TOKEN is configured"
            )
        return None
    if not host:
        if debug:
            raise RuntimeError(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing once "
                "POSTHOG_HOST is configured"
            )
        return None

    posthog_client = Posthog(
        project_api_key=project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


def shutdown_posthog() -> None:
    """Flush the shared client during application shutdown."""
    if posthog_client is not None:
        posthog_client.flush()
