"""PostHog request context middleware."""

from http.cookies import SimpleCookie
from typing import Optional

from posthog import identify_context, new_context, tag

from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Bind the authenticated user to the PostHog context for each HTTP request."""

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if (
            scope["type"] != "http"
            or not self.settings.posthog_project_token
            or not self.settings.posthog_host
        ):
            await self.app(scope, receive, send)
            return

        user = self._get_user_from_scope(scope)
        with new_context():
            if user is not None:
                identify_context(str(user.id))
                tag("email", user.email)
                tag("credits", user.credits)
                tag("is_active", user.is_active)

            await self.app(scope, receive, send)

    @staticmethod
    def _get_user_from_scope(scope) -> Optional[User]:
        """Resolve the signed session cookie to the authenticated user."""
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

        if not user_id:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
