"""Shared PostHog client utilities for the meeting summarizer."""

import atexit
import logging
import os
from typing import Optional

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()

_posthog_client: Optional[Posthog] = None


def get_posthog_client() -> Optional[Posthog]:
    """Return a shared PostHog client instance when configured."""
    global _posthog_client

    if _posthog_client is not None:
        return _posthog_client

    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')
    if not project_token:
        logging.warning('PostHog not configured: POSTHOG_PROJECT_TOKEN not set')
        return None

    _posthog_client = Posthog(
        project_token,
        host=os.getenv('POSTHOG_HOST'),
        enable_exception_autocapture=True
    )
    atexit.register(_posthog_client.shutdown)
    return _posthog_client


def capture_event(distinct_id: Optional[str], event: str, properties: Optional[dict] = None):
    """Capture an event if PostHog is configured."""
    client = get_posthog_client()
    if not client or not distinct_id:
        return

    client.capture(event, distinct_id=distinct_id, properties=properties or {})


def capture_exception(exception: Exception, distinct_id: Optional[str] = None, properties: Optional[dict] = None):
    """Capture a handled exception if PostHog is configured."""
    client = get_posthog_client()
    if not client:
        return

    kwargs = {'properties': properties or {}}
    if distinct_id:
        kwargs['distinct_id'] = distinct_id

    client.capture_exception(exception, **kwargs)


def identify_user(user):
    """Set person properties for a user without putting PII on events."""
    client = get_posthog_client()
    if not client or not user:
        return

    client.set(
        distinct_id=user.user_id,
        properties={
            'email': user.email,
            'username': user.username,
            'full_name': user.full_name,
            'is_active': user.is_active,
            'role': (user.metadata or {}).get('role')
        }
    )

    client.set_once(
        distinct_id=user.user_id,
        properties={
            'initial_account_created_at': user.created_at.isoformat()
        }
    )
