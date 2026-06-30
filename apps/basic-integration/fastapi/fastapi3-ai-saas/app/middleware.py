"""Middleware module for the application."""

from http.cookies import SimpleCookie
from typing import Optional

from posthog import identify_context, new_context, set_context_session

from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Pure ASGI middleware that wraps each request in a PostHog context.

    Identifies authenticated users so route handlers can call capture()
    without explicitly passing a distinct_id each time.
    """

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or self.settings.posthog_disabled:
            await self.app(scope, receive, send)
            return

        user = self._get_user_from_scope(scope)
        ph_distinct_id = self._get_header(scope, b"x-posthog-distinct-id")
        ph_session_id = self._get_header(scope, b"x-posthog-session-id")

        with new_context():
            if user:
                identify_context(user.email)
            elif ph_distinct_id:
                identify_context(ph_distinct_id)
            if ph_session_id:
                set_context_session(ph_session_id)

            await self.app(scope, receive, send)

    def _get_header(self, scope, name: bytes) -> Optional[str]:
        headers = dict(scope.get("headers", []))
        value = headers.get(name, b"")
        return value.decode("utf-8") if value else None

    def _get_user_from_scope(self, scope) -> Optional[User]:
        """Extract the authenticated user from the session cookie in the ASGI scope."""
        headers = dict(scope.get("headers", []))
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
