import atexit

from django.apps import AppConfig
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


posthog_client = None


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        global posthog_client

        if not settings.POSTHOG_PROJECT_TOKEN or not settings.POSTHOG_HOST:
            if settings.DEBUG:
                missing_var = (
                    'POSTHOG_PROJECT_TOKEN'
                    if not settings.POSTHOG_PROJECT_TOKEN
                    else 'POSTHOG_HOST'
                )
                raise ImproperlyConfigured(
                    f'{missing_var} variable required by PostHog is missing or '
                    f'un-configured, this causes events to be silently missed. '
                    f'This error stops appearing once {missing_var} is configured'
                )
            return

        from posthog import Posthog

        posthog_client = Posthog(
            project_api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        settings.POSTHOG_MW_CLIENT = posthog_client
        atexit.register(posthog_client.shutdown)

        # The middleware opens the request context before the login view changes
        # request.user. This signal updates that ambient context once login succeeds.
        from django.contrib.auth.signals import user_logged_in
        from django.dispatch import receiver

        @receiver(user_logged_in, weak=False)
        def identify_posthog_user(sender, request, user, **kwargs):
            distinct_id = str(user.pk)
            posthog_client.identify_context(distinct_id)
            posthog_client.set(
                distinct_id=distinct_id,
                properties={
                    'email': user.email,
                    'username': user.username,
                    'company_name': user.company_name,
                },
            )
