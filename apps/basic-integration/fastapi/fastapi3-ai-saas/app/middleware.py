"""Request middleware for the application."""

from http.cookies import SimpleCookie

from app.config import get_settings
from app.dependencies import serializer
from app.posthog import get_posthog_client


class PostHogRequestContextMiddleware:
    """Bind PostHog context to the authenticated user for each HTTP request."""

    def __init__(self, app):
        self.app = app
        self.settings = get_settings()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        posthog_client = get_posthog_client()
        if posthog_client is None:
            await self.app(scope, receive, send)
            return

        with posthog_client.new_context(fresh=True):
            user_id = self._get_session_user_id(scope)
            if user_id is not None:
                posthog_client.identify_context(str(user_id))
            await self.app(scope, receive, send)

    def _get_session_user_id(self, scope) -> int | None:
        """Extract the stable user ID from the signed session cookie."""
        headers = dict(scope.get("headers", []))
        cookie_header = headers.get(b"cookie", b"").decode("latin-1")
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

        return user_id if isinstance(user_id, int) else None
