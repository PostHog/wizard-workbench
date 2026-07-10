import atexit

from django.apps import AppConfig
from django.conf import settings
from posthog import Posthog

posthog_client = Posthog(
    project_api_key=settings.POSTHOG_PROJECT_TOKEN,
    host=settings.POSTHOG_HOST,
    disabled=settings.POSTHOG_DISABLED or not settings.POSTHOG_PROJECT_TOKEN,
    enable_exception_autocapture=True,
)
atexit.register(posthog_client.shutdown)


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        settings.POSTHOG_MW_CLIENT = posthog_client
