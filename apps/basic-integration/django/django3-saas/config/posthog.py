"""Application-wide PostHog client for Django."""

import atexit

from posthog import Posthog

posthog_client = None


def initialize_posthog(project_token, host):
    """Create the process-wide client when analytics is configured."""
    global posthog_client

    if not project_token or not host:
        return None

    posthog_client = Posthog(
        project_api_key=project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client
