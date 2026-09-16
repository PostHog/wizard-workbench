"""Application configuration for process-wide services."""

import atexit

from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.core.exceptions import ImproperlyConfigured

from posthog import Posthog


posthog_client = None


def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the already-open login request after Django authenticates a user."""
    distinct_id = str(user.pk)
    posthog_client.identify_context(distinct_id)
    posthog_client.set(
        distinct_id=distinct_id,
        properties={
            "email": user.email,
            "name": user.get_full_name() or user.username,
            "is_staff": user.is_staff,
        },
    )


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        """Initialize the PostHog client once when Django starts."""
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
        atexit.register(posthog_client.shutdown)
        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid="posthog.identify_authenticated_user",
            weak=False,
        )
