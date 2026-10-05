"""Django application configuration for shared PostHog initialization."""

import atexit
import logging

from django.apps import AppConfig
from django.conf import settings


posthog_client = None
posthog_log = logging.getLogger('posthog.exporter')


def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the active request after Django completes a login."""
    posthog_client.identify_context(str(user.pk))
    posthog_client.set(
        distinct_id=str(user.pk),
        properties={
            'email': user.email,
            'username': user.username,
            'company_name': user.company_name,
        },
    )


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        """Initialize the shared PostHog client once when Django starts."""
        global posthog_client

        if not settings.POSTHOG_PROJECT_TOKEN:
            if settings.DEBUG:
                raise RuntimeError(
                    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing '
                    'or un-configured, this causes events to be silently missed. '
                    'This error stops appearing once POSTHOG_PROJECT_TOKEN is configured'
                )
            return

        if not settings.POSTHOG_HOST:
            if settings.DEBUG:
                raise RuntimeError(
                    'POSTHOG_HOST variable required by PostHog is missing or '
                    'un-configured, this causes events to be silently missed. '
                    'This error stops appearing once POSTHOG_HOST is configured'
                )
            return

        from posthog import Posthog

        posthog_client = Posthog(
            project_api_key=settings.POSTHOG_PROJECT_TOKEN,
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
                'Authorization': f'Bearer {settings.POSTHOG_PROJECT_TOKEN}',
            },
        )
        logger_provider.add_log_record_processor(
            BatchLogRecordProcessor(log_exporter)
        )
        posthog_log.setLevel(logging.INFO)
        posthog_log.addHandler(LoggingHandler(logger_provider=logger_provider))
        posthog_log.propagate = False
        atexit.register(logger_provider.shutdown)

        settings.POSTHOG_MW_CLIENT = posthog_client

        from django.contrib.auth.signals import user_logged_in

        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid='posthog.identify_posthog_user',
        )
