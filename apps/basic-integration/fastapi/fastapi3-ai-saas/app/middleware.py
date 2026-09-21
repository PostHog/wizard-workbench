"""Request middleware for the application."""

from http.cookies import SimpleCookie

from itsdangerous import BadSignature

from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Bind the authenticated user to the PostHog context for each request."""

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = getattr(scope["app"].state, "posthog_client", None)
        user = self._get_authenticated_user(scope)
        if not posthog_client or not user:
            await self.app(scope, receive, send)
            return

        with posthog_client.new_context(fresh=True):
            posthog_client.identify_context(str(user.id))
            posthog_client.set(properties={"email": user.email})
            await self.app(scope, receive, send)

    def _get_authenticated_user(self, scope) -> User | None:
        """Resolve the current user from the signed session cookie."""
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
            user_id = serializer.loads(session_cookie.value).get("user_id")
        except BadSignature:
            return None

        if not user_id:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
