import atexit
from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        from django.conf import settings
        from posthog import Posthog
        from config import posthog_client as ph_module

        client = Posthog(
            api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        ph_module.posthog_client = client
        atexit.register(client.shutdown)
