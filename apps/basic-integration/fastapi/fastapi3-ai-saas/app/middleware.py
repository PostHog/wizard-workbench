"""Request middleware for application-wide PostHog identity context."""

from http.cookies import SimpleCookie

from posthog import identify_context, new_context

import app.posthog_client as posthog_module
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Identify authenticated users once for the lifetime of each HTTP request."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or posthog_module.posthog_client is None:
            await self.app(scope, receive, send)
            return

        user = self._get_authenticated_user(scope)
        with new_context():
            if user is not None:
                identify_context(str(user.id))
            await self.app(scope, receive, send)

    @staticmethod
    def _get_authenticated_user(scope) -> User | None:
        """Resolve the signed session cookie to the app's stable user primary key."""
        headers = dict(scope.get("headers", []))
        cookie_header = headers.get(b"cookie", b"").decode("utf-8")
        if not cookie_header:
            return None

        cookies = SimpleCookie()
        cookies.load(cookie_header)
        session_cookie = cookies.get("session_token")
        if session_cookie is None:
            return None

        try:
            session_data = serializer.loads(session_cookie.value)
            user_id = session_data.get("user_id")
        except Exception:
            return None

        if not isinstance(user_id, int):
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
