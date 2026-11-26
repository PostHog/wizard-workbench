"""Authentication dependencies for FastAPI."""

from typing import Annotated, Optional

from fastapi import Cookie, Depends, HTTPException, Request, status
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


def identify_user(request: Request, user: User) -> None:
    """Bind the authenticated user to the active PostHog request context."""
    posthog_client = getattr(request.app.state, "posthog_client", None)
    if posthog_client is None:
        return

    distinct_id = str(user.id)
    posthog_client.identify_context(distinct_id)
    posthog_client.set(
        distinct_id=distinct_id,
        properties={"email": user.email, "credits": user.credits},
    )


def identify_current_user(
    request: Request,
    current_user: Annotated[Optional[User], Depends(get_current_user)],
) -> None:
    """Identify the authenticated user once for the entire request."""
    if current_user is not None:
        identify_user(request, current_user)


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
