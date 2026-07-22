"""Request-scoped PostHog context for authenticated users."""

from http.cookies import SimpleCookie

from itsdangerous import BadSignature
from posthog import identify_context, new_context

from app import posthog_client
from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User

settings = get_settings()


class PostHogMiddleware:
    """Bind the authenticated user to PostHog for the lifetime of each request."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or posthog_client.posthog_client is None:
            await self.app(scope, receive, send)
            return

        user = self._get_user(scope)
        with new_context():
            if user is not None:
                identify_context(str(user.id))
            await self.app(scope, receive, send)

    @staticmethod
    def _get_user(scope) -> User | None:
        """Load the authenticated user from the signed session cookie."""
        headers = dict(scope.get("headers", []))
        cookie_header = headers.get(b"cookie", b"").decode("utf-8")
        if not cookie_header:
            return None

        cookies = SimpleCookie()
        cookies.load(cookie_header)
        session_cookie = cookies.get(settings.session_cookie_name)
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
