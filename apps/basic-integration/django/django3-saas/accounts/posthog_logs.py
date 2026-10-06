"""Isolated OpenTelemetry export for logs introduced by this integration."""

import atexit
import logging

from django.conf import settings
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor


posthog_logger = logging.getLogger('posthog_app_logs')
posthog_logger.setLevel(logging.INFO)
posthog_logger.propagate = False


def configure_posthog_log_exporter():
    """Export only records created through ``posthog_logger``."""
    if not settings.POSTHOG_PROJECT_TOKEN or not settings.POSTHOG_HOST:
        return

    if any(
        getattr(handler, '_posthog_log_exporter', False)
        for handler in posthog_logger.handlers
    ):
        return

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{settings.POSTHOG_HOST.rstrip('/')}/i/v1/logs",
        headers={
            'Authorization': f'Bearer {settings.POSTHOG_PROJECT_TOKEN}',
        },
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    handler = LoggingHandler(logger_provider=logger_provider)
    handler._posthog_log_exporter = True
    posthog_logger.addHandler(handler)
    atexit.register(logger_provider.shutdown)
