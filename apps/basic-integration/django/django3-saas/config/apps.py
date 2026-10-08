"""Django application configuration."""

from django.apps import AppConfig
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

from .posthog import initialize_posthog
from .posthog_logs import configure_posthog_logs


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        for variable_name, value in (
            ('POSTHOG_API_KEY', settings.POSTHOG_API_KEY),
            ('POSTHOG_HOST', settings.POSTHOG_HOST),
        ):
            if value:
                continue
            if settings.DEBUG:
                raise ImproperlyConfigured(
                    f'{variable_name} variable required by PostHog is missing or '
                    f'un-configured, this causes events to be silently missed. This '
                    f'error stops appearing once {variable_name} is configured'
                )
            return

        initialize_posthog(settings.POSTHOG_API_KEY, settings.POSTHOG_HOST)
        configure_posthog_logs(settings.POSTHOG_API_KEY, settings.POSTHOG_HOST)

        from . import signals  # noqa: F401
