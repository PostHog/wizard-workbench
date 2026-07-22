import atexit
import os

from django.apps import AppConfig


class ConfigConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'config'

    def ready(self):
        from posthog import Posthog

        project_token = os.environ.get('POSTHOG_PROJECT_TOKEN')
        host = os.environ.get('POSTHOG_HOST')
        self.posthog_client = None

        if not project_token or not host:
            if os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes'):
                missing = 'POSTHOG_PROJECT_TOKEN' if not project_token else 'POSTHOG_HOST'
                raise RuntimeError(
                    f'{missing} variable required by PostHog is missing or un-configured, '
                    f'this causes events to be silently missed. This error stops appearing '
                    f'once {missing} is configured'
                )
            return

        self.posthog_client = Posthog(
            project_token,
            host=host,
            enable_exception_autocapture=True,
        )
        atexit.register(self.posthog_client.shutdown)

        from accounts import signals  # noqa: F401

