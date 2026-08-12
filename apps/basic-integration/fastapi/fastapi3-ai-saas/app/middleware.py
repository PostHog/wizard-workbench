"""Request-scoped PostHog identity middleware."""

from http.cookies import SimpleCookie

from app.analytics import get_posthog_client
from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Identify authenticated users for all PostHog activity in an HTTP request."""

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        client = get_posthog_client()
        if client is None:
            await self.app(scope, receive, send)
            return

        user = self._get_user_from_scope(scope)
        with client.new_context(fresh=True):
            if user is not None:
                client.identify_context(str(user.id))
            await self.app(scope, receive, send)

    def _get_user_from_scope(self, scope) -> User | None:
        """Resolve the signed session cookie to its authenticated user."""
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
            session_data = serializer.loads(session_cookie.value)
            user_id = session_data.get("user_id")
        except Exception:
            return None

        if not isinstance(user_id, int):
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
