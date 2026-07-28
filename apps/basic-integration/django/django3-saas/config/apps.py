import atexit
import os

from django.apps import AppConfig


posthog_client = None


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        global posthog_client
        token = os.environ.get('POSTHOG_PROJECT_TOKEN')
        host = os.environ.get('POSTHOG_HOST')
        if not token or not host:
            if os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes'):
                missing = 'POSTHOG_PROJECT_TOKEN' if not token else 'POSTHOG_HOST'
                raise RuntimeError(
                    f'{missing} variable required by PostHog is missing or un-configured, '
                    f'this causes events to be silently missed. This error stops appearing '
                    f'once {missing} is configured'
                )
            return

        import posthog

        posthog_client = posthog.Posthog(
            project_api_key=token,
            host=host,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)

