"""PostHog analytics helpers for server-side events."""

from typing import Any

from posthog import Posthog

_client: Posthog | None = None


def configure(client: Posthog) -> None:
    """Register the initialized PostHog client."""
    global _client
    _client = client


def identify_user(user_id: int, email: str) -> None:
    """Associate a stable user identifier with person properties."""
    if _client is not None:
        _client.set(str(user_id), {"email": email})


def capture_event(user_id: int, event: str, properties: dict[str, Any] | None = None) -> None:
    """Capture an event with a stable distinct ID and non-PII metadata."""
    if _client is not None:
        _client.capture(str(user_id), event, properties=properties or {})
