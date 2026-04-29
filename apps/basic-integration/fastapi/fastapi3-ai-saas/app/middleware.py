"""Middleware module for the application."""

from http.cookies import SimpleCookie
from typing import Optional

from itsdangerous import BadSignature, URLSafeSerializer
from posthog import identify_context, new_context, tag

from app.config import get_settings
from app.database import SessionLocal
from app.models import User

settings = get_settings()
serializer = URLSafeSerializer(settings.secret_key)


class PostHogMiddleware:
    """Pure ASGI middleware that wraps each request in a PostHog context.

    If the user is authenticated, identifies them in the context so route
    handlers can call capture() without needing to set up context each time.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or not settings.posthog_api_key:
            await self.app(scope, receive, send)
            return

        user = self._get_user_from_scope(scope)

        with new_context():
            if user:
                identify_context(str(user.id))
                tag("credits", user.credits)

            await self.app(scope, receive, send)

    def _get_user_from_scope(self, scope) -> Optional[User]:
        """Extract authenticated user from session cookie in ASGI scope."""
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
        except (BadSignature, Exception):
            return None

        if not user_id:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
