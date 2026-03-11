from django.apps import AppConfig
from django.conf import settings


class ConfigConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'config'

    def ready(self):
        import posthog

        posthog.api_key = settings.POSTHOG_KEY
        posthog.host = settings.POSTHOG_HOST

        if settings.POSTHOG_DISABLED:
            posthog.disabled = True

        if settings.DEBUG:
            posthog.debug = True
