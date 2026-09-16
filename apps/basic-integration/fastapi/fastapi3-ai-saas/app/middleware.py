"""Request middleware for PostHog context and user identification."""

from http.cookies import SimpleCookie
from typing import Optional

from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User
from app.posthog_client import get_posthog_client


class PostHogMiddleware:
    """Bind the authenticated user to a fresh PostHog context per request."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = get_posthog_client()
        if posthog_client is None:
            await self.app(scope, receive, send)
            return

        user = self._get_user_from_scope(scope)
        with posthog_client.new_context(fresh=True):
            if user is not None:
                distinct_id = str(user.id)
                scope.setdefault("state", {})["posthog_distinct_id"] = distinct_id
                posthog_client.identify_context(distinct_id)
            await self.app(scope, receive, send)

    @staticmethod
    def _get_user_from_scope(scope) -> Optional[User]:
        """Resolve the signed session cookie to the authenticated user."""
        headers = dict(scope.get("headers", []))
        cookie_header = headers.get(b"cookie", b"").decode("latin-1")
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

        if user_id is None:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
