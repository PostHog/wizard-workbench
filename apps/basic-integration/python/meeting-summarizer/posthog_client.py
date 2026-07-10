"""PostHog client helpers for the AI Meeting Summarizer."""

import atexit
import logging
import os
from typing import Optional

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()

_posthog_client: Optional[Posthog] = None


def get_posthog_client() -> Optional[Posthog]:
    """Create or return the shared PostHog client."""
    global _posthog_client

    if _posthog_client is not None:
        return _posthog_client

    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')
    if not project_token:
        logging.warning('PostHog disabled: POSTHOG_PROJECT_TOKEN is not set')
        return None

    client_kwargs = {
        'enable_exception_autocapture': True,
    }
    host = os.getenv('POSTHOG_HOST')
    if host:
        client_kwargs['host'] = host

    _posthog_client = Posthog(
        project_token,
        **client_kwargs,
    )
    atexit.register(_posthog_client.shutdown)
    return _posthog_client


def capture_event(distinct_id: str, event: str, properties: Optional[dict] = None) -> None:
    """Capture an event if PostHog is configured."""
    client = get_posthog_client()
    if not client:
        return

    client.capture(
        distinct_id=distinct_id,
        event=event,
        properties=properties or {}
    )


def set_person_properties(distinct_id: str, properties: dict) -> None:
    """Set person properties if PostHog is configured."""
    client = get_posthog_client()
    if not client:
        return

    client.set(
        distinct_id=distinct_id,
        properties=properties
    )


def alias_distinct_id(previous_id: str, distinct_id: str) -> None:
    """Alias an anonymous distinct ID to an authenticated user ID."""
    client = get_posthog_client()
    if not client or not previous_id or previous_id == distinct_id:
        return

    client.alias(previous_id=previous_id, distinct_id=distinct_id)


def capture_exception(error: Exception, distinct_id: Optional[str] = None, properties: Optional[dict] = None) -> None:
    """Capture a handled exception if PostHog is configured."""
    client = get_posthog_client()
    if not client:
        return

    client.capture_exception(
        error,
        distinct_id=distinct_id,
        properties=properties or {}
    )
