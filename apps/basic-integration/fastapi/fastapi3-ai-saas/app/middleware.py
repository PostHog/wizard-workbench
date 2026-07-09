"""PostHog middleware for request-scoped analytics context."""

from http.cookies import SimpleCookie
from typing import Optional

from posthog import identify_context, new_context, set_context_session

from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Wrap each HTTP request in a PostHog context and identify the user when present."""

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or not self.settings.posthog_api_key:
            await self.app(scope, receive, send)
            return

        user = self._get_user_from_scope(scope)
        session_id = self._get_header(scope, b"x-posthog-session-id")
        distinct_id = self._get_header(scope, b"x-posthog-distinct-id")

        with new_context():
            if session_id:
                set_context_session(session_id)

            if distinct_id:
                identify_context(distinct_id)
            elif user:
                identify_context(str(user.id))

            await self.app(scope, receive, send)

    def _get_user_from_scope(self, scope) -> Optional[User]:
        """Extract authenticated user from session cookie in ASGI scope."""
        cookie_header = self._get_header(scope, b"cookie")
        if not cookie_header:
            return None

        cookies = SimpleCookie()
        cookies.load(cookie_header)

        session_cookie = cookies.get("session_token")
        if not session_cookie:
            return None

        try:
            data = serializer.loads(session_cookie.value)
            user_id = data.get("user_id")
        except Exception:
            return None

        if not user_id:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()

    @staticmethod
    def _get_header(scope, header_name: bytes) -> Optional[str]:
        """Extract a decoded header value from the ASGI scope."""
        headers = dict(scope.get("headers", []))
        value = headers.get(header_name)
        if value is None:
            return None
        return value.decode("utf-8")
