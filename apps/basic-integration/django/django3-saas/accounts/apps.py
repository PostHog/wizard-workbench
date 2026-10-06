"""Application configuration for accounts."""

import atexit

from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.core.exceptions import ImproperlyConfigured

from posthog import Posthog

from .posthog_logs import configure_posthog_log_exporter


class _NoOpPosthogClient:
    def capture(self, *args, **kwargs):
        pass


posthog_client = _NoOpPosthogClient()


def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the PostHog request context after a successful login."""
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


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        """Initialize the shared PostHog client when Django starts."""
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
            project_api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        settings.POSTHOG_MW_CLIENT = posthog_client
        atexit.register(posthog_client.shutdown)
        configure_posthog_log_exporter()

        # The login signal updates the request context after Django authenticates
        # a user, which the middleware cannot see at request start.
        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid='accounts.posthog_identify_user',
        )
