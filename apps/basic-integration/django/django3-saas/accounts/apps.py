import atexit

import posthog
from django.apps import AppConfig
from django.conf import settings
from posthog import Posthog


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        posthog_client = Posthog(
            settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        posthog.default_client = posthog_client
        atexit.register(posthog_client.shutdown)
