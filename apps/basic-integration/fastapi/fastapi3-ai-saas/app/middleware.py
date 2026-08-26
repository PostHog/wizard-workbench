"""Request-scoped PostHog identity middleware."""

from http.cookies import SimpleCookie

from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Open a PostHog context for every HTTP request."""

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        from app.main import posthog_client

        if posthog_client is None:
            await self.app(scope, receive, send)
            return

        user = self._get_user(scope)
        with posthog_client.new_context():
            if user is not None:
                self.identify_user(user)
            await self.app(scope, receive, send)

    @staticmethod
    def identify_user(user: User) -> None:
        """Associate the current request with an authenticated user."""
        from app.main import posthog_client

        if posthog_client is None:
            return

        distinct_id = str(user.id)
        posthog_client.identify_context(distinct_id)
        posthog_client.set(distinct_id=distinct_id, properties={"email": user.email})

    def _get_user(self, scope) -> User | None:
        """Resolve the signed session cookie to the app's stable user record."""
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
            user_id = data.get("user_id")
        except Exception:
            return None

        if not isinstance(user_id, int):
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
