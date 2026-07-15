import atexit

from django.apps import AppConfig
from django.conf import settings
import posthog


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
    posthog_client = None

    def ready(self):
        self.posthog_client = posthog.Posthog(
            project_api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        atexit.register(self.posthog_client.shutdown)
