import atexit
import os

from django.apps import AppConfig
from django.conf import settings


class PostHogIntegrationConfig(AppConfig):
    name = 'posthog_integration'

    def ready(self):
        token = os.environ.get('POSTHOG_PROJECT_TOKEN')
        host = os.environ.get('POSTHOG_HOST')
        if not token or not host:
            if settings.DEBUG:
                missing = 'POSTHOG_PROJECT_TOKEN' if not token else 'POSTHOG_HOST'
                raise RuntimeError(
                    f'{missing} variable required by PostHog is missing or un-configured, '
                    f'this causes events to be silently missed. This error stops appearing once {missing} is configured'
                )
            return

        from posthog import Posthog

        client = Posthog(
            project_api_key=token,
            host=host,
            enable_exception_autocapture=True,
        )
        self.posthog = client
        import posthog_integration
        posthog_integration.client = client
        atexit.register(client.shutdown)

        from django.contrib.auth.signals import user_logged_in
        from django.dispatch import receiver

        @receiver(user_logged_in, weak=False)
        def identify_posthog_user(sender, request, user, **kwargs):
            user_id = str(user.pk)
            client.identify_context(user_id)
            client.set(
                distinct_id=user_id,
                properties={
                    'email': user.email,
                    'username': user.username,
                    'name': user.get_full_name() or user.username,
                    'company_name': user.company_name,
                },
            )
