"""Django application configuration for PostHog."""

import atexit

from django.apps import AppConfig
from django.conf import settings

posthog_client = None


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        """Create the process-wide PostHog client when configured."""
        global posthog_client

        for variable, value in (
            ('POSTHOG_PROJECT_TOKEN', settings.POSTHOG_PROJECT_TOKEN),
            ('POSTHOG_HOST', settings.POSTHOG_HOST),
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
            project_api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)

        from django.contrib.auth.signals import user_logged_in

        def identify_logged_in_user(sender, request, user, **kwargs):
            """Identify the login request after Django updates request.user."""
            distinct_id = str(user.pk)
            posthog_client.identify_context(distinct_id)
            posthog_client.set(
                distinct_id=distinct_id,
                properties={
                    'email': user.email,
                    'username': user.username,
                    'name': user.get_full_name(),
                    'company_name': user.company_name,
                },
            )

        user_logged_in.connect(
            identify_logged_in_user,
            dispatch_uid='posthog_identify_logged_in_user',
            weak=False,
        )
