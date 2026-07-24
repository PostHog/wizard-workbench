"""Request-scoped PostHog identity middleware."""

from http.cookies import SimpleCookie
from typing import Optional

from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User
from app import posthog as posthog_module


class PostHogIdentityMiddleware:
    """Bind the authenticated user to every HTTP request's PostHog context."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or posthog_module.posthog_client is None:
            await self.app(scope, receive, send)
            return

        user = self._get_user_from_scope(scope)
        with posthog_module.posthog_client.new_context():
            if user is not None:
                posthog_module.posthog_client.identify_context(
                    str(user.id),
                    properties={"email": user.email, "credits": user.credits},
                )
            await self.app(scope, receive, send)

    @staticmethod
    def _get_user_from_scope(scope) -> Optional[User]:
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
