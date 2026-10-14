"""Django application configuration for process-wide services."""

import atexit
import logging

from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from posthog import Posthog


posthog_client = None


def get_posthog_client():
    """Return the SDK client initialized during Django startup, if configured."""
    return posthog_client


def configure_posthog_log_exporter():
    """Export only purpose-written PostHog logs through an isolated logger."""
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f'{settings.POSTHOG_HOST.rstrip("/")}/i/v1/logs',
        headers={
            'Authorization': f'Bearer {settings.POSTHOG_PROJECT_TOKEN}',
        },
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    logger = logging.getLogger('posthog.exporter')
    logger.setLevel(logging.INFO)
    logger.propagate = False
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)


@receiver(user_logged_in, dispatch_uid='config.identify_posthog_user')
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the login request after Django has authenticated its user."""
    client = get_posthog_client()
    if client is None:
        return

    distinct_id = str(user.pk)
    client.identify_context(distinct_id)
    client.set(
        distinct_id=distinct_id,
        properties={
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'company_name': user.company_name,
            'is_staff': user.is_staff,
        },
    )


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        """Initialize the PostHog client once for the Django process."""
        global posthog_client

        if not settings.POSTHOG_PROJECT_TOKEN or not settings.POSTHOG_HOST:
            if settings.DEBUG:
                missing_variable = (
                    'POSTHOG_PROJECT_TOKEN'
                    if not settings.POSTHOG_PROJECT_TOKEN
                    else 'POSTHOG_HOST'
                )
                raise RuntimeError(
                    f'{missing_variable} variable required by PostHog is missing or '
                    f'un-configured, this causes events to be silently missed. This '
                    f'error stops appearing once {missing_variable} is configured'
                )
            return

        posthog_client = Posthog(
            project_api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        # The middleware is instantiated after app startup, so it can use this
        # client for the active request context and automatic exceptions.
        settings.POSTHOG_MW_CLIENT = posthog_client
        atexit.register(posthog_client.shutdown)
        configure_posthog_log_exporter()
