"""Middleware for request-scoped PostHog identity."""

from http.cookies import SimpleCookie

from itsdangerous import BadSignature

from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User
from app.posthog import get_posthog_client


class PostHogContextMiddleware:
    """Bind the authenticated user to all PostHog work in an HTTP request."""

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

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
                posthog_client.identify_context(str(user.id))
            await self.app(scope, receive, send)

    def _get_user_from_scope(self, scope) -> User | None:
        """Load the session user so the request context uses the stable user ID."""
        headers = dict(scope.get("headers", []))
        cookie_header = headers.get(b"cookie", b"").decode("utf-8")
        if not cookie_header:
            return None

        cookies = SimpleCookie()
        cookies.load(cookie_header)
        session_cookie = cookies.get(self.settings.session_cookie_name)
        if session_cookie is None:
            return None

        try:
            data = serializer.loads(session_cookie.value)
        except BadSignature:
            return None

        user_id = data.get("user_id")
        if user_id is None:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
