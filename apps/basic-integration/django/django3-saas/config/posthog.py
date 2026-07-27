"""Shared PostHog client initialized during Django startup."""

import atexit
import os


posthog_client = None


def initialize_posthog():
    """Create the process-wide PostHog client when configuration is available."""
    global posthog_client

    project_token = os.environ.get('POSTHOG_PROJECT_TOKEN')
    host = os.environ.get('POSTHOG_HOST')
    missing = 'POSTHOG_PROJECT_TOKEN' if not project_token else 'POSTHOG_HOST' if not host else None
    if missing:
        if os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes'):
            raise RuntimeError(
                f'{missing} variable required by PostHog is missing or un-configured, '
                f'this causes events to be silently missed. This error stops appearing '
                f'once {missing} is configured'
            )
        return

    from posthog import Posthog

    posthog_client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
