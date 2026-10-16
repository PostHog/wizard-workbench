"""Django application configuration for shared services."""

import atexit

from django.apps import AppConfig, apps
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.core.exceptions import ImproperlyConfigured
from django.dispatch import receiver
from posthog import Posthog


class ConfigConfig(AppConfig):
    name = 'config'
    posthog_client = None

    def ready(self):
        """Initialize the process-wide PostHog client when configured."""
        if not settings.POSTHOG_PROJECT_TOKEN:
            if settings.DEBUG:
                raise ImproperlyConfigured(
                    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or '
                    'un-configured, this causes events to be silently missed. This error '
                    'stops appearing once POSTHOG_PROJECT_TOKEN is configured'
                )
            return

        if not settings.POSTHOG_HOST:
            if settings.DEBUG:
                raise ImproperlyConfigured(
                    'POSTHOG_HOST variable required by PostHog is missing or un-configured, '
                    'this causes events to be silently missed. This error stops appearing '
                    'once POSTHOG_HOST is configured'
                )
            return

        self.posthog_client = Posthog(
            settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        settings.POSTHOG_MW_CLIENT = self.posthog_client
        atexit.register(self.posthog_client.shutdown)

        from .posthog_logs import configure_posthog_log_capture

        log_provider = configure_posthog_log_capture(
            settings.POSTHOG_PROJECT_TOKEN,
            settings.POSTHOG_HOST,
        )
        atexit.register(log_provider.shutdown)


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the ambient PostHog context after Django authenticates a user."""
    posthog_client = apps.get_app_config('config').posthog_client
    if posthog_client is None:
        return

    distinct_id = str(user.pk)
    posthog_client.identify_context(distinct_id)
    posthog_client.set(
        distinct_id=distinct_id,
        properties={
            'email': user.email,
            'username': user.username,
            'name': user.get_full_name() or user.username,
        },
    )
