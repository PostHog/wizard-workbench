import atexit

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        from .posthog import posthog_client

        atexit.register(posthog_client.shutdown)
