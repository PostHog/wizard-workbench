import atexit

from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.core.exceptions import ImproperlyConfigured
from django.dispatch import receiver

posthog_client = None


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the request context after Django authenticates a user."""
    if posthog_client is None:
        return

    user_id = str(user.pk)
    posthog_client.identify_context(user_id)
    posthog_client.set(
        distinct_id=user_id,
        properties={
            'email': user.email,
            'name': user.get_full_name() or user.username,
            'company_name': user.company_name,
        },
    )


class DashboardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dashboard'

    def ready(self):
        global posthog_client

        for variable_name, value in (
            ('POSTHOG_PROJECT_TOKEN', settings.POSTHOG_PROJECT_TOKEN),
            ('POSTHOG_HOST', settings.POSTHOG_HOST),
        ):
            if not value:
                if settings.DEBUG:
                    raise ImproperlyConfigured(
                        f'{variable_name} variable required by PostHog is missing or '
                        f'un-configured, this causes events to be silently missed. This '
                        f'error stops appearing once {variable_name} is configured'
                    )
                return

        from posthog import Posthog

        posthog_client = Posthog(
            settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)
