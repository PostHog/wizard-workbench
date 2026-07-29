"""Request middleware for application integrations."""

from http.cookies import SimpleCookie

from app.config import get_settings
from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogContextMiddleware:
    """Bind the authenticated user to the PostHog context for each HTTP request."""

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = getattr(scope["app"].state, "posthog_client", None)
        if posthog_client is None:
            await self.app(scope, receive, send)
            return

        user = self._get_user_from_scope(scope)
        with posthog_client.new_context():
            if user is not None:
                distinct_id = str(user.id)
                posthog_client.identify_context(distinct_id)
                posthog_client.set(
                    distinct_id=distinct_id,
                    properties={"email": user.email, "is_active": user.is_active},
                )
            await self.app(scope, receive, send)

    def _get_user_from_scope(self, scope) -> User | None:
        """Load the authenticated user from the signed session cookie."""
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

        if user_id is None:
            return None

        db = SessionLocal()
        try:
            return User.get_by_id(db, user_id)
        finally:
            db.close()
