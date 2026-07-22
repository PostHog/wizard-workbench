"""Request middleware for application-wide concerns."""

from http.cookies import SimpleCookie
from typing import Optional

from itsdangerous import BadSignature

from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Bind the authenticated user to the PostHog context for each request."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = getattr(scope["app"].state, "posthog", None)
        if posthog_client is None:
            await self.app(scope, receive, send)
            return

        user = self._get_user_from_scope(scope)
        with posthog_client.new_context():
            if user is not None:
                posthog_client.identify_context(str(user.id))
                posthog_client.set(
                    distinct_id=str(user.id),
                    properties={"email": user.email, "credits": user.credits},
                )
            await self.app(scope, receive, send)

    @staticmethod
    def _get_user_from_scope(scope) -> Optional[User]:
        """Resolve the session cookie's stable user id to an authenticated user."""
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
        except BadSignature:
            return None
        if user_id is None:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
