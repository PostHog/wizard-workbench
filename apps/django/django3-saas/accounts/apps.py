from django.apps import AppConfig
from django.conf import settings


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        """
        Initialize PostHog when Django starts.

        This method is called once when Django starts. We configure the
        PostHog SDK here so it's available everywhere in the application.
        """
        import posthog

        posthog.api_key = settings.POSTHOG_API_KEY
        posthog.host = settings.POSTHOG_HOST

        if getattr(settings, 'POSTHOG_DISABLED', False):
            posthog.disabled = True

        if settings.DEBUG:
            posthog.debug = True
