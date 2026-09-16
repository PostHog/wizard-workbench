"""Request-scoped PostHog context middleware."""

from http.cookies import SimpleCookie

from app.config import get_settings
from app.dependencies import serializer
from app.posthog import get_posthog_client


class PostHogMiddleware:
    """Bind the signed-in user's stable ID to the full HTTP request context."""

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = get_posthog_client()
        if not posthog_client:
            await self.app(scope, receive, send)
            return

        with posthog_client.new_context(fresh=True):
            user_id = self._get_session_user_id(scope)
            if user_id is not None:
                posthog_client.identify_context(str(user_id))

            await self.app(scope, receive, send)

    def _get_session_user_id(self, scope) -> int | None:
        """Read the stable user ID from the application's signed session cookie."""
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
        except Exception:
            return None

        return user_id if isinstance(user_id, int) else None
