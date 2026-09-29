"""Application configuration for project-wide services."""

import atexit
import logging

from django.apps import AppConfig
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


posthog_client = None
posthog_log_logger = logging.getLogger('posthog.export')


def get_posthog_client():
    """Return the shared PostHog client, or None when analytics is unconfigured."""
    return posthog_client


def get_posthog_log_logger():
    """Return the dedicated PostHog log logger when its exporter is configured."""
    return posthog_log_logger if posthog_log_logger.handlers else None


def identify_logged_in_user(sender, request, user, **kwargs):
    """Identify the login request after Django has authenticated the user."""
    distinct_id = str(user.pk)
    posthog_client.identify_context(distinct_id)
    posthog_client.set(
        distinct_id=distinct_id,
        properties={
            'email': user.email,
            'name': user.get_full_name(),
            'username': user.username,
            'company_name': user.company_name,
            'is_staff': user.is_staff,
        },
    )


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        """Configure the shared PostHog client after Django has loaded settings."""
        global posthog_client

        for variable_name in ('POSTHOG_PROJECT_API_KEY', 'POSTHOG_HOST'):
            if not getattr(settings, variable_name):
                if settings.DEBUG:
                    raise ImproperlyConfigured(
                        f'{variable_name} variable required by PostHog is missing or '
                        f'un-configured, this causes events to be silently missed. This '
                        f'error stops appearing once {variable_name} is configured'
                    )
                return

        from posthog import Posthog

        posthog_client = Posthog(
            settings.POSTHOG_PROJECT_API_KEY,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)

        from opentelemetry._logs import set_logger_provider
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

        logger_provider = LoggerProvider()
        set_logger_provider(logger_provider)
        log_exporter = OTLPLogExporter(
            endpoint=f'{settings.POSTHOG_HOST.rstrip("/")}/i/v1/logs',
            headers={
                'Authorization': f'Bearer {settings.POSTHOG_PROJECT_API_KEY}',
            },
        )
        logger_provider.add_log_record_processor(
            BatchLogRecordProcessor(log_exporter)
        )
        posthog_log_logger.setLevel(logging.INFO)
        posthog_log_logger.propagate = False
        posthog_log_logger.addHandler(
            LoggingHandler(logger_provider=logger_provider)
        )
        atexit.register(logger_provider.shutdown)

        from django.contrib.auth.signals import user_logged_in

        user_logged_in.connect(
            identify_logged_in_user,
            dispatch_uid='posthog_identify_logged_in_user',
        )
