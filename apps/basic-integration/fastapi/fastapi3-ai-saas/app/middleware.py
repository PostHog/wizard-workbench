"""Request middleware for application-wide concerns."""

from http.cookies import SimpleCookie

from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User
from app.posthog import get_posthog_client


class PostHogMiddleware:
    """Bind the authenticated user to the PostHog context for each HTTP request."""

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = get_posthog_client()
        if not posthog_client:
            await self.app(scope, receive, send)
            return

        user = self._get_authenticated_user(scope)
        with posthog_client.new_context():
            if user:
                posthog_client.identify_context(str(user.id))
            await self.app(scope, receive, send)

    def _get_authenticated_user(self, scope) -> User | None:
        """Load the session's user so the request context uses their stable ID."""
        headers = dict(scope.get("headers", []))
        cookie_header = headers.get(b"cookie", b"").decode("utf-8")
        if not cookie_header:
            return None

        cookies = SimpleCookie()
        cookies.load(cookie_header)
        session_cookie = cookies.get(self.settings.session_cookie_name)
        if not session_cookie:
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
