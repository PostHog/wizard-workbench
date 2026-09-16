import atexit

from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.core.exceptions import ImproperlyConfigured
from django.dispatch import receiver
from posthog import Posthog


posthog_client = None


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the ambient PostHog context after Django authenticates a user."""
    if posthog_client is None:
        return

    distinct_id = str(user.pk)
    posthog_client.identify_context(distinct_id)
    posthog_client.set(
        distinct_id=distinct_id,
        properties={
            "email": user.email,
            "name": user.get_full_name(),
        },
    )


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        if not settings.POSTHOG_PROJECT_TOKEN:
            if settings.DEBUG:
                raise ImproperlyConfigured(
                    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, '
                    'this causes events to be silently missed. This error stops appearing once '
                    'POSTHOG_PROJECT_TOKEN is configured'
                )
            return

        if not settings.POSTHOG_HOST:
            if settings.DEBUG:
                raise ImproperlyConfigured(
                    'POSTHOG_HOST variable required by PostHog is missing or un-configured, '
                    'this causes events to be silently missed. This error stops appearing once '
                    'POSTHOG_HOST is configured'
                )
            return

        global posthog_client
        posthog_client = Posthog(
            project_api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        settings.POSTHOG_MW_CLIENT = posthog_client
        atexit.register(posthog_client.shutdown)
