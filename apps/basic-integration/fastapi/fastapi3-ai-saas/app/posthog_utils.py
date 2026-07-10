"""PostHog helpers for request-scoped tracking."""

from contextlib import contextmanager
from typing import Any, Iterator

from posthog import identify_context, new_context

from app.models import User
from app.posthog_client import posthog_client


@contextmanager
def user_event_context(user: User) -> Iterator[None]:
    """Create a PostHog context for an authenticated user."""
    with new_context(client=posthog_client):
        identify_context(str(user.id))
        yield


def identify_user(user: User) -> None:
    """Set person properties for a user without placing PII on events."""
    posthog_client.set(
        distinct_id=str(user.id),
        properties={
            "email": user.email,
            "credits": user.credits,
            "is_active": user.is_active,
        },
    )


def capture_user_event(user: User, event: str, properties: dict[str, Any] | None = None) -> None:
    """Capture an event for an authenticated user."""
    with user_event_context(user):
        posthog_client.capture(event, properties=properties or {})


def capture_user_exception(
    user: User,
    error: Exception,
    properties: dict[str, Any] | None = None,
) -> None:
    """Capture an exception for an authenticated user."""
    with user_event_context(user):
        posthog_client.capture_exception(error, properties=properties or {})
