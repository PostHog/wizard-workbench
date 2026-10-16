"""Request middleware for the application."""

from http.cookies import SimpleCookie

from itsdangerous import BadSignature

from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogIdentityMiddleware:
    """Bind authenticated users to a fresh PostHog context for each request."""

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = scope["app"].state.posthog_client
        if posthog_client is None:
            await self.app(scope, receive, send)
            return

        user = self._get_authenticated_user(scope)
        with posthog_client.new_context(fresh=True):
            if user is not None:
                distinct_id = str(user.id)
                posthog_client.identify_context(distinct_id)
                posthog_client.set(distinct_id, {"email": user.email})
            await self.app(scope, receive, send)

    def _get_authenticated_user(self, scope) -> User | None:
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
            user_id = serializer.loads(session_cookie.value).get("user_id")
        except BadSignature:
            return None

        if user_id is None:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
