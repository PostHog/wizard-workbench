"""Middleware module for the application."""

from http.cookies import SimpleCookie
from typing import Optional

from posthog import identify_context, new_context, tag, set_context_session

from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Pure ASGI middleware that wraps each request in a PostHog context.

    If the user is authenticated, identifies them in the context so route
    handlers can call posthog.capture() without setting up context each time.
    Also extracts X-POSTHOG-DISTINCT-ID and X-POSTHOG-SESSION-ID headers so
    client-side and server-side events can be correlated.
    """

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        headers = dict(scope.get("headers", []))
        user = self._get_user_from_scope(headers)
        client_distinct_id = headers.get(b"x-posthog-distinct-id", b"").decode("utf-8") or None
        client_session_id = headers.get(b"x-posthog-session-id", b"").decode("utf-8") or None

        with new_context():
            if user:
                identify_context(str(user.id))
                tag("email", user.email)
            elif client_distinct_id:
                identify_context(client_distinct_id)

            if client_session_id:
                set_context_session(client_session_id)

            await self.app(scope, receive, send)

    def _get_user_from_scope(self, headers: dict) -> Optional[User]:
        """Extract authenticated user from session cookie in ASGI scope headers."""
        cookie_header = headers.get(b"cookie", b"").decode("utf-8")
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
