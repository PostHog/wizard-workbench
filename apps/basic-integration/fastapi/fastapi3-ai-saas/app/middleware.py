"""PostHog request context middleware."""

from http.cookies import SimpleCookie

from posthog import identify_context, new_context

from app.database import SessionLocal
from app.dependencies import serializer
from app.models import User


class PostHogMiddleware:
    """Bind authenticated requests to their PostHog identity context."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = self._get_posthog_client(scope)
        if posthog_client is None:
            await self.app(scope, receive, send)
            return

        user = self._get_authenticated_user(scope)
        with new_context():
            if user is not None:
                distinct_id = str(user.id)
                identify_context(distinct_id)
                posthog_client.set(
                    distinct_id=distinct_id,
                    properties={"email": user.email, "credits": user.credits},
                )
            await self.app(scope, receive, send)

    @staticmethod
    def _get_posthog_client(scope):
        app = scope.get("app")
        return getattr(app.state, "posthog_client", None) if app else None

    @staticmethod
    def _get_authenticated_user(scope) -> User | None:
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
