"""Application configuration for the accounts app."""

import atexit

from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.core.exceptions import ImproperlyConfigured
from posthog import Posthog

class _NoopPosthogClient:
    def capture(self, *args, **kwargs):
        pass


posthog_client = _NoopPosthogClient()


def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the context after Django authenticates a user in this request."""
    user_id = str(user.pk)
    posthog_client.identify_context(user_id)
    posthog_client.set(
        distinct_id=user_id,
        properties={
            'email': user.email,
            'name': user.get_full_name(),
            'username': user.username,
            'company_name': user.company_name,
            'is_staff': user.is_staff,
        },
    )


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        """Initialize the shared PostHog client once Django is ready."""
        global posthog_client

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

        posthog_client = Posthog(
            settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        settings.POSTHOG_MW_CLIENT = posthog_client
        atexit.register(posthog_client.shutdown)
        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid='accounts.identify_posthog_user',
        )
