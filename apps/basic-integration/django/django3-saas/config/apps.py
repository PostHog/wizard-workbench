"""Django application configuration."""

import atexit

from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.core.exceptions import ImproperlyConfigured
from django.dispatch import receiver
from posthog import identify_context


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the active request after Django authenticates a user."""
    distinct_id = str(user.pk)
    identify_context(distinct_id)

    from .posthog import get_posthog_client

    client = get_posthog_client()
    if client is not None:
        client.set(
            distinct_id=distinct_id,
            properties={
                'email': user.email,
                'username': user.username,
                'is_staff': user.is_staff,
            },
        )


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        """Initialize the process-wide PostHog client after Django starts."""
        from . import posthog

        missing_variables = [
            variable
            for variable, value in (
                ('POSTHOG_PROJECT_TOKEN', settings.POSTHOG_PROJECT_TOKEN),
                ('POSTHOG_HOST', settings.POSTHOG_HOST),
            )
            if not value
        ]
        if missing_variables:
            if settings.DEBUG:
                variable = missing_variables[0]
                raise ImproperlyConfigured(
                    f'{variable} variable required by PostHog is missing or '
                    f'un-configured, this causes events to be silently missed. '
                    f'This error stops appearing once {variable} is configured'
                )
            return

        posthog.posthog_client = posthog.Posthog(
            settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        settings.POSTHOG_MW_CLIENT = posthog.posthog_client
        atexit.register(posthog.posthog_client.shutdown)

        from .posthog_logs import configure_posthog_log_exporter

        log_provider = configure_posthog_log_exporter(
            settings.POSTHOG_PROJECT_TOKEN,
            settings.POSTHOG_HOST,
        )
        atexit.register(log_provider.shutdown)
