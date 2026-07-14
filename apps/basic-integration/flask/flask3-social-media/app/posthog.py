import uuid
from typing import Optional
from flask import current_app
from posthog import Posthog


def get_posthog_client() -> Optional[Posthog]:
    return current_app.extensions.get('posthog')


def get_distinct_id(user) -> str:
    return f'user-{user.id}'


def set_user_properties(posthog_client: Optional[Posthog], user) -> None:
    if posthog_client is None:
        return
    posthog_client.set(
        distinct_id=get_distinct_id(user),
        properties={
            'email': user.email,
            'username': user.username,
            'last_seen': user.last_seen.isoformat() if user.last_seen else None,
        },
    )


def capture_for_user(posthog_client: Optional[Posthog], user, event: str,
                     properties: Optional[dict] = None) -> None:
    if posthog_client is None:
        return
    posthog_client.capture(
        event,
        distinct_id=get_distinct_id(user),
        properties=properties or {},
    )


def new_session_id() -> str:
    return str(uuid.uuid4())
