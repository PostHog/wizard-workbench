"""Dedicated OpenTelemetry log export for PostHog instrumentation."""

import atexit
import logging
import os

from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor


posthog_logger = logging.getLogger('posthog.logs')


def configure_posthog_logs():
    """Export only log records emitted by this integration's dedicated logger."""
    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)

    log_exporter = OTLPLogExporter(
        endpoint=f"{os.environ['POSTHOG_HOST'].rstrip('/')}/i/v1/logs",
        headers={
            'Authorization': f"Bearer {os.environ['POSTHOG_PROJECT_TOKEN']}",
        },
    )
    logger_provider.add_log_record_processor(
        BatchLogRecordProcessor(log_exporter)
    )

    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    posthog_logger.setLevel(logging.INFO)
    posthog_logger.propagate = False
    atexit.register(logger_provider.shutdown)
