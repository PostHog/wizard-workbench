"""Authentication dependencies for FastAPI."""

from typing import Annotated, Optional

from fastapi import Cookie, Depends, HTTPException, status
from itsdangerous import BadSignature, URLSafeSerializer
from posthog import identify_context
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import User

settings = get_settings()
serializer = URLSafeSerializer(settings.secret_key)


def get_session_user_id(session_token: Annotated[Optional[str], Cookie()] = None) -> Optional[int]:
    """Extract user ID from session cookie."""
    if not session_token:
        return None
    try:
        data = serializer.loads(session_token)
        return data.get("user_id")
    except BadSignature:
        return None


def identify_user(user: User) -> None:
    """Bind the authenticated user to the active PostHog request context."""
    identify_context(str(user.id))


def set_person_properties(user: User) -> None:
    """Update PII only on the PostHog person profile, never event properties."""
    from app.main import posthog_client

    if posthog_client:
        posthog_client.set(
            distinct_id=str(user.id),
            properties={"email": user.email},
        )


def capture_event(event: str, properties: dict | None = None) -> None:
    """Capture an event using the active request's PostHog identity context."""
    from app.main import posthog_client

    if posthog_client:
        posthog_client.capture(event, properties=properties)


def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    user_id: Annotated[Optional[int], Depends(get_session_user_id)],
) -> Optional[User]:
    """Get and identify the current authenticated user for this request."""
    if user_id is None:
        return None

    user = User.get_by_id(db, user_id)
    if user:
        identify_user(user)
    return user


def require_auth(
    current_user: Annotated[Optional[User], Depends(get_current_user)],
) -> User:
    """Require authentication - raises 401 if not authenticated."""
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return current_user


def create_session_token(user_id: int) -> str:
    """Create a signed session token for the user."""
    return serializer.dumps({"user_id": user_id})


# Type aliases for cleaner dependency injection
CurrentUser = Annotated[Optional[User], Depends(get_current_user)]
RequiredUser = Annotated[User, Depends(require_auth)]
DbSession = Annotated[Session, Depends(get_db)]
