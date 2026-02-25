import atexit
from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        """Initialize PostHog when Django starts."""
        import posthog
        from django.conf import settings

        posthog.api_key = settings.POSTHOG_API_KEY
        posthog.host = settings.POSTHOG_HOST
        posthog.enable_exception_autocapture = True

        atexit.register(posthog.shutdown)
