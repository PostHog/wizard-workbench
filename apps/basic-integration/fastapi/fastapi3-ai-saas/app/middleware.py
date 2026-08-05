"""Request-scoped PostHog identification middleware."""

from http.cookies import SimpleCookie

from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User
from app.posthog import initialize_posthog


class PostHogMiddleware:
    """Identify authenticated users for all analytics within an HTTP request."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = initialize_posthog()
        if posthog_client is None:
            await self.app(scope, receive, send)
            return

        user_id = self._get_authenticated_user_id(scope)
        with posthog_client.new_context(fresh=True):
            if user_id is not None:
                posthog_client.identify_context(str(user_id))
            await self.app(scope, receive, send)

    @staticmethod
    def _get_authenticated_user_id(scope) -> int | None:
        """Resolve and validate the session user before identifying the request."""
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
            session_data = serializer.loads(session_cookie.value)
            user_id = session_data.get("user_id")
        except Exception:
            return None

        if not isinstance(user_id, int):
            return None

        db = SessionLocal()
        try:
            user = User.get_by_id(db, user_id)
            return user.id if user is not None else None
        finally:
            db.close()
