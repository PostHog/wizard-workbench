"""Request middleware for PostHog context and user identification."""

from http.cookies import SimpleCookie

from posthog import Posthog

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

        posthog_client: Posthog | None = getattr(
            scope["app"].state, "posthog_client", None
        )
        if not posthog_client:
            await self.app(scope, receive, send)
            return

        user = self._get_user_from_scope(scope)
        with posthog_client.new_context():
            if user:
                posthog_client.identify_context(str(user.id))
            await self.app(scope, receive, send)

    @staticmethod
    def _get_user_from_scope(scope) -> User | None:
        """Resolve the signed session cookie to its authenticated user."""
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

        if not user_id:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
