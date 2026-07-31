"""Request-scoped PostHog identity middleware."""

from http.cookies import SimpleCookie

from app import posthog
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Bind the authenticated session user to PostHog for each HTTP request."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or posthog.posthog_client is None:
            await self.app(scope, receive, send)
            return

        user = self._get_user_from_scope(scope)
        with posthog.posthog_client.new_context():
            if user is not None:
                posthog.posthog_client.identify_context(str(user.id))
                posthog.posthog_client.set(
                    str(user.id),
                    properties={
                        "email": user.email,
                        "credits": user.credits,
                        "is_active": user.is_active,
                    },
                )
            await self.app(scope, receive, send)

    @staticmethod
    def _get_user_from_scope(scope) -> User | None:
        """Resolve the authenticated user from the signed session cookie."""
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
