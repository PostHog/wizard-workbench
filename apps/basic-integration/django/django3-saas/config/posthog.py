"""Shared PostHog client construction for the Django application."""

import atexit

from posthog import Posthog


def create_posthog_client(project_api_key, host):
    """Create the process-wide PostHog client and flush it at shutdown."""
    client = Posthog(
        project_api_key=project_api_key,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client
