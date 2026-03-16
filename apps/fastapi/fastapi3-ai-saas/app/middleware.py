"""Middleware module for the application."""

from typing import Optional

from itsdangerous import BadSignature, URLSafeSerializer
from posthog import identify_context, new_context, tag
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.config import get_settings
from app.database import SessionLocal
from app.models import User


class PostHogMiddleware(BaseHTTPMiddleware):
    """Middleware that wraps each request in a PostHog context.

    If the user is authenticated, identifies them in the context so routes
    can call capture() without needing to set up context each time.
    """

    def __init__(self, app):
        super().__init__(app)
        self.settings = get_settings()
        self._serializer = URLSafeSerializer(self.settings.secret_key)

    async def dispatch(self, request: Request, call_next) -> Response:
        if self.settings.posthog_disabled:
            return await call_next(request)

        user = self._get_user_from_request(request)

        with new_context():
            if user:
                identify_context(str(user.id))
                tag("credits", user.credits)
                tag("is_active", user.is_active)

            response = await call_next(request)

        return response

    def _get_user_from_request(self, request: Request) -> Optional[User]:
        """Extract authenticated user from session cookie."""
        session_token = request.cookies.get(self.settings.session_cookie_name)
        if not session_token:
            return None
        try:
            data = self._serializer.loads(session_token)
            user_id = data.get("user_id")
        except BadSignature:
            return None

        if user_id is None:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
