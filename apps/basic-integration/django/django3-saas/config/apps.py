import atexit

from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from posthog import Posthog


posthog_client = None


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the context created before a login view authenticates a user."""
    if posthog_client is None:
        return

    user_id = str(user.pk)
    posthog_client.identify_context(user_id)
    posthog_client.set(
        distinct_id=user_id,
        properties={
            'email': user.email,
            'username': user.username,
            'name': user.get_full_name() or user.username,
            'company_name': user.company_name,
            'is_staff': user.is_staff,
        },
    )


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        global posthog_client

        missing_variable = next(
            (
                variable
                for variable, value in (
                    ('POSTHOG_PROJECT_TOKEN', settings.POSTHOG_PROJECT_TOKEN),
                    ('POSTHOG_HOST', settings.POSTHOG_HOST),
                )
                if not value
            ),
            None,
        )
        if missing_variable:
            if settings.DEBUG:
                raise RuntimeError(
                    f'{missing_variable} variable required by PostHog is missing or '
                    f'un-configured, this causes events to be silently missed. This '
                    f'error stops appearing once {missing_variable} is configured'
                )
            return

        posthog_client = Posthog(
            settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        settings.POSTHOG_MW_CLIENT = posthog_client
        atexit.register(posthog_client.shutdown)
