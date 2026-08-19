"""Django application configuration, including PostHog initialization."""

import atexit
import os

from django.apps import AppConfig
from django.conf import settings

posthog_client = None


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        """Initialize the shared PostHog client when credentials are configured."""
        global posthog_client

        api_key = os.environ.get('POSTHOG_PROJECT_TOKEN')
        host = os.environ.get('POSTHOG_HOST')

        for variable, value in (
            ('POSTHOG_PROJECT_TOKEN', api_key),
            ('POSTHOG_HOST', host),
        ):
            if not value:
                if settings.DEBUG:
                    raise RuntimeError(
                        f'{variable} variable required by PostHog is missing or '
                        f'un-configured, this causes events to be silently missed. '
                        f'This error stops appearing once {variable} is configured'
                    )
                return

        from posthog import Posthog

        posthog_client = Posthog(
            project_api_key=api_key,
            host=host,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)

        from django.contrib.auth.signals import user_logged_in
        from django.dispatch import receiver

        @receiver(user_logged_in, dispatch_uid='posthog.identify_authenticated_user')
        def identify_authenticated_posthog_user(sender, request, user, **kwargs):
            """Identify the middleware context after Django authenticates a user."""
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
