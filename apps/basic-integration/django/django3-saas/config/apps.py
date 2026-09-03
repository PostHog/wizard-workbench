"""Django application configuration."""

import atexit

from django.apps import AppConfig
from django.conf import settings

posthog_client = None


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        """Initialize the shared PostHog client once Django has started."""
        global posthog_client

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

        posthog_client = Posthog(
            project_api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)

        # The middleware has already opened the request context by the time a
        # login or registration authenticates someone. Identify that context
        # when Django's authentication flow learns who the user is.
        from django.contrib.auth.signals import user_logged_in
        from posthog import identify_context

        def identify_posthog_user(sender, request, user, **kwargs):
            user_id = str(user.pk)
            identify_context(user_id)
            posthog_client.set(
                distinct_id=user_id,
                properties={
                    'email': user.email,
                    'name': user.get_full_name() or user.username,
                    'company_name': user.company_name,
                    'is_staff': user.is_staff,
                },
            )

        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid='posthog_identify_authenticated_user',
            weak=False,
        )
