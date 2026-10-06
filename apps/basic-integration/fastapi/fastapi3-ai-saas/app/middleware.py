"""Request middleware for application-wide PostHog context."""

from http.cookies import SimpleCookie

from itsdangerous import BadSignature

from app.config import get_settings
from app.dependencies import serializer
from app.posthog_client import get_posthog_client


class PostHogContextMiddleware:
    """Identify the authenticated user for all analytics within an HTTP request."""

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

    def _get_session_user_id(self, scope):
        """Return the authenticated user's stable ID from the signed session cookie."""
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
            return serializer.loads(session_cookie.value).get("user_id")
        except BadSignature:
            return None
