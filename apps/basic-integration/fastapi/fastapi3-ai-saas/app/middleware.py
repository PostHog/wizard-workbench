"""Request-scoped PostHog context middleware."""

from http.cookies import SimpleCookie

from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Identify authenticated requests in an isolated PostHog context."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = getattr(scope["app"].state, "posthog_client", None)
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
        cookie_header = headers.get(b"cookie", b"").decode("latin-1")
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
