"""PostHog analytics client for AI Meeting Summarizer."""

import os
import logging
from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _initialize_posthog():
    """Initialize and return a PostHog instance."""
    api_key = os.getenv('POSTHOG_PROJECT_API_KEY')
    host = os.getenv('POSTHOG_HOST', 'https://us.i.posthog.com')

    if not api_key:
        logging.warning("PostHog not configured (POSTHOG_PROJECT_API_KEY not set). Analytics will be disabled.")
        return None

    return Posthog(
        api_key,
        host=host,
        enable_exception_autocapture=True,
    )


posthog = _initialize_posthog()


def capture(distinct_id, event, properties=None):
    """Capture a PostHog event. No-op if PostHog is not configured."""
    if posthog is None:
        return
    posthog.capture(distinct_id=distinct_id, event=event, properties=properties or {})


def identify(distinct_id, properties=None):
    """Identify a user with PostHog. No-op if PostHog is not configured."""
    if posthog is None:
        return
    posthog.capture(
        distinct_id=distinct_id,
        event='$identify',
        properties={'$set': properties or {}},
    )


def capture_exception(e, distinct_id=None):
    """Manually capture an exception. No-op if PostHog is not configured."""
    if posthog is None:
        return
    posthog.capture_exception(e, distinct_id)
