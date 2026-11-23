"""PostHog client shared by Django request middleware and application code."""

import atexit

from posthog import Posthog


def create_posthog_client(project_token, host):
    """Create the process-wide PostHog client when it is configured."""
    if not project_token or not host:
        return None

    client = Posthog(
        project_api_key=project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client
