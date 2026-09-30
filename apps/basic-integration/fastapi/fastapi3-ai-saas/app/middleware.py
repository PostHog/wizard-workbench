"""Middleware for request-scoped PostHog identity."""

from http.cookies import SimpleCookie

from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Bind the authenticated user to the shared PostHog client per request."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = scope["app"].state.posthog_client
        if not posthog_client:
            await self.app(scope, receive, send)
            return

        with posthog_client.new_context(fresh=True):
            user = self._get_user(scope)
            if user:
                posthog_client.identify_context(str(user.id))

            await self.app(scope, receive, send)

    @staticmethod
    def _get_user(scope):
        """Return the user authenticated by the signed session cookie, if any."""
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
            user_id = serializer.loads(session_cookie.value).get("user_id")
        except Exception:
            return None

        if not isinstance(user_id, int):
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
