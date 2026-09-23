"""Django application configuration for shared service initialization."""

import atexit
import logging

import posthog
from django.apps import AppConfig
from django.conf import settings
from posthog import Posthog


posthog_client = None
posthog_log_provider = None


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        """Initialize the shared PostHog client once Django has loaded settings."""
        global posthog_client

        if not settings.POSTHOG_PROJECT_TOKEN or not settings.POSTHOG_HOST:
            return

        posthog_client = Posthog(
            settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        posthog.default_client = posthog_client
        atexit.register(posthog_client.shutdown)
        self._configure_posthog_log_capture()

    def _configure_posthog_log_capture(self):
        """Export only records emitted through the dedicated PostHog logger."""
        global posthog_log_provider

        if posthog_log_provider is not None:
            return

        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
        from opentelemetry.sdk.resources import Resource

        posthog_log_provider = LoggerProvider(
            resource=Resource.create({'service.name': settings.BASE_DIR.name})
        )
        exporter = OTLPLogExporter(
            endpoint=f'{settings.POSTHOG_HOST.rstrip("/")}/i/v1/logs',
            headers={
                'Authorization': f'Bearer {settings.POSTHOG_PROJECT_TOKEN}',
            },
        )
        posthog_log_provider.add_log_record_processor(
            BatchLogRecordProcessor(exporter)
        )

        posthog_logger = logging.getLogger('posthog.exporter')
        posthog_logger.setLevel(logging.INFO)
        posthog_logger.propagate = False
        posthog_logger.addHandler(
            LoggingHandler(level=logging.INFO, logger_provider=posthog_log_provider)
        )
        atexit.register(posthog_log_provider.shutdown)
