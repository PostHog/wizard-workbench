"""Authentication dependencies for FastAPI."""

from typing import Annotated, Optional
from uuid import UUID

from fastapi import Cookie, Depends, Header, HTTPException, status
from itsdangerous import BadSignature, URLSafeSerializer
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


def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    user_id: Annotated[Optional[int], Depends(get_session_user_id)],
) -> Optional[User]:
    """Get the current authenticated user, or None if not authenticated."""
    if user_id is None:
        return None
    return User.get_by_id(db, user_id)


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


def get_posthog_distinct_id(
    x_posthog_distinct_id: Annotated[Optional[str], Header()] = None,
    current_user: Annotated[Optional[User], Depends(get_current_user)] = None,
) -> Optional[str]:
    """Resolve a stable distinct ID for PostHog events."""
    if x_posthog_distinct_id:
        return x_posthog_distinct_id
    if current_user:
        return str(current_user.id)
    return None


def get_posthog_session_id(
    x_posthog_session_id: Annotated[Optional[str], Header()] = None,
) -> Optional[str]:
    """Resolve a forwarded PostHog session ID if present."""
    if not x_posthog_session_id:
        return None

    try:
        return str(UUID(x_posthog_session_id))
    except ValueError:
        return None


# Type aliases for cleaner dependency injection
CurrentUser = Annotated[Optional[User], Depends(get_current_user)]
RequiredUser = Annotated[User, Depends(require_auth)]
DbSession = Annotated[Session, Depends(get_db)]
PostHogDistinctId = Annotated[Optional[str], Depends(get_posthog_distinct_id)]
PostHogSessionId = Annotated[Optional[str], Depends(get_posthog_session_id)]
