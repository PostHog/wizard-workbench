from django.apps import AppConfig


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
        from django.conf import settings

        posthog.api_key = settings.POSTHOG_API_KEY
        posthog.host = settings.POSTHOG_HOST

        if settings.POSTHOG_DISABLED:
            posthog.disabled = True

        if settings.DEBUG:
            posthog.debug = True
