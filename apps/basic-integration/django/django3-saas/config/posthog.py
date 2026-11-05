"""Shared PostHog client configuration for the Django application."""

import atexit

from posthog import Posthog


def create_posthog_client(project_token, host):
    """Create the process-wide client and flush pending events at exit."""
    client = Posthog(
        project_api_key=project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client
