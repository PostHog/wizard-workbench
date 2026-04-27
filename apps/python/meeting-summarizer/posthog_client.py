"""PostHog analytics client for AI Meeting Summarizer."""

import logging
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def initialize_posthog():
    """Initialize PostHog with instance-based API.

    Returns a Posthog instance, or None if the project token is not configured.
    """
    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')

    if not project_token:
        logging.warning(
            "PostHog not configured (POSTHOG_PROJECT_TOKEN not set). "
            "App will work but analytics won't be tracked."
        )
        return None

    host = os.getenv('POSTHOG_HOST')
    kwargs = {'enable_exception_autocapture': True}
    if host:
        kwargs['host'] = host

    return Posthog(project_token, **kwargs)


posthog_client = initialize_posthog()
