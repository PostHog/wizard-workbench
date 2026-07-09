import atexit

from django.apps import AppConfig
from django.conf import settings


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        import posthog

        if getattr(self, '_posthog_initialized', False):
            return

        if not settings.POSTHOG_PROJECT_TOKEN or not settings.POSTHOG_HOST:
            return

        posthog.posthog = posthog.Posthog(
            api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog.posthog.shutdown)
        self._posthog_initialized = True
