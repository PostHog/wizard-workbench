"""Request middleware for application-wide PostHog identity context."""

from http.cookies import SimpleCookie

from posthog import identify_context, new_context

from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogRequestContextMiddleware:
    """Bind the authenticated user to the PostHog context for each HTTP request."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        user = self._get_authenticated_user(scope)
        with new_context():
            if user is not None:
                identify_context(str(user.id))
            await self.app(scope, receive, send)

    @staticmethod
    def _get_authenticated_user(scope) -> User | None:
        """Resolve the signed session cookie to the app's stable user identifier."""
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
            user_id = serializer.loads(session_cookie.value).get("user_id")
        except Exception:
            return None
        if user_id is None:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
