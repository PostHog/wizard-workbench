"""Accounts application configuration."""

import atexit

from django.apps import AppConfig, apps
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the ambient request context after Django authenticates a user."""
    posthog_client = apps.get_app_config('accounts').posthog_client
    if not posthog_client:
        return

    distinct_id = str(user.pk)
    posthog_client.identify_context(distinct_id)
    posthog_client.set(
        distinct_id=distinct_id,
        properties={
            'email': user.email,
            'username': user.username,
            'is_staff': user.is_staff,
        },
    )


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
    posthog_client = None

    def ready(self):
        """Configure the shared PostHog client when Django starts."""
        if not settings.POSTHOG_PROJECT_TOKEN:
            if settings.DEBUG:
                raise RuntimeError(
                    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or '
                    'un-configured, this causes events to be silently missed. This error '
                    'stops appearing once POSTHOG_PROJECT_TOKEN is configured'
                )
            return

        if not settings.POSTHOG_HOST:
            if settings.DEBUG:
                raise RuntimeError(
                    'POSTHOG_HOST variable required by PostHog is missing or un-configured, '
                    'this causes events to be silently missed. This error stops appearing '
                    'once POSTHOG_HOST is configured'
                )
            return

        from posthog import Posthog

        self.posthog_client = Posthog(
            settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        atexit.register(self.posthog_client.shutdown)
