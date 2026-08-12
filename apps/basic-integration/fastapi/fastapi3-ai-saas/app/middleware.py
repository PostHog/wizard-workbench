"""Request-scoped PostHog identity middleware."""

from http.cookies import SimpleCookie

from app.analytics import get_posthog_client
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogIdentityMiddleware:
    """Bind the authenticated user to the PostHog context for one request."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = get_posthog_client()
        if not posthog_client:
            await self.app(scope, receive, send)
            return

        user = self._get_user(scope)
        with posthog_client.new_context(fresh=True):
            if user:
                posthog_client.identify_context(str(user.id))
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
        if not session_cookie:
            return None

        try:
            session_data = serializer.loads(session_cookie.value)
            user_id = session_data.get("user_id")
        except Exception:
            return None

        if not user_id:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
