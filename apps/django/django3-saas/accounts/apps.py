from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        from django.conf import settings
        import posthog

        posthog.api_key = settings.POSTHOG_KEY
        posthog.host = settings.POSTHOG_HOST

        if settings.POSTHOG_DISABLED:
            posthog.disabled = True

        if settings.DEBUG:
            posthog.debug = True
