"""Request-scoped PostHog context middleware."""

from http.cookies import SimpleCookie
from typing import Callable

from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User
from posthog import Posthog, identify_context


class PostHogMiddleware:
    """Bind the authenticated user to PostHog for the lifetime of each request."""

    def __init__(self, app, get_client: Callable[[], Posthog | None]):
        self.app = app
        self.get_client = get_client

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        client = self.get_client()
        if client is None:
            await self.app(scope, receive, send)
            return

        with client.new_context():
            user = self._get_user(scope)
            if user is not None:
                identify_context(str(user.id))
            await self.app(scope, receive, send)

    @staticmethod
    def _get_user(scope) -> User | None:
        """Resolve the authenticated user from the signed session cookie."""
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
            user_id = serializer.loads(session_cookie.value).get("user_id")
        except Exception:
            return None
        if user_id is None:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
