"""Application-wide PostHog client initialization."""

import atexit
import logging
import os

from dotenv import load_dotenv
from posthog import Posthog


_posthog_client = None


def initialize_posthog():
    """Create the process-wide PostHog client when it is configured."""
    global _posthog_client

    if _posthog_client is not None:
        return _posthog_client

    load_dotenv()
    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')
    host = os.getenv('POSTHOG_HOST')

    if not project_token or not host:
        if os.getenv('ENVIRONMENT', 'development').lower() != 'production':
            missing_variable = 'POSTHOG_PROJECT_TOKEN' if not project_token else 'POSTHOG_HOST'
            logging.warning(
                '%s variable required by PostHog is missing or un-configured, '
                'this causes events to be silently missed. This error stops '
                'appearing once %s is configured',
                missing_variable,
                missing_variable,
            )
        return None

    _posthog_client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(_posthog_client.shutdown)
    return _posthog_client


def get_posthog_client():
    """Return the shared PostHog client, or None when unconfigured."""
    return _posthog_client
