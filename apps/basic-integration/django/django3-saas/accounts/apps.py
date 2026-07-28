import atexit

from django.apps import AppConfig
from django.conf import settings


posthog_client = None


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        global posthog_client

        token = settings.POSTHOG_PROJECT_TOKEN
        host = settings.POSTHOG_HOST
        if not token or not host:
            if settings.DEBUG:
                missing = 'POSTHOG_PROJECT_TOKEN' if not token else 'POSTHOG_HOST'
                raise RuntimeError(
                    f'{missing} variable required by PostHog is missing or un-configured, '
                    f'this causes events to be silently missed. This error stops appearing '
                    f'once {missing} is configured'
                )
            return

        from posthog import Posthog

        posthog_client = Posthog(
            token,
            host=host,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)

        from django.contrib.auth.signals import user_logged_in
        from django.dispatch import receiver
        from posthog import identify_context

        @receiver(user_logged_in)
        def identify_posthog_user(sender, request, user, **kwargs):
            identify_context(str(user.pk))
            posthog_client.set(
                distinct_id=str(user.pk),
                properties={
                    'email': user.email,
                    'username': user.username,
                },
            )
