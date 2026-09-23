"""Request middleware for PostHog identity context."""

from http.cookies import SimpleCookie

from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Bind the authenticated user to the PostHog context for each request."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = getattr(scope["app"].state, "posthog", None)
        if posthog_client is None:
            await self.app(scope, receive, send)
            return

        with posthog_client.new_context(fresh=True):
            user = self._get_authenticated_user(scope)
            if user is not None:
                distinct_id = str(user.id)
                scope.setdefault("state", {})["posthog_distinct_id"] = distinct_id
                posthog_client.identify_context(distinct_id)

            await self.app(scope, receive, send)

    @staticmethod
    def _get_authenticated_user(scope) -> User | None:
        """Load the session user for this request, if the session is valid."""
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
