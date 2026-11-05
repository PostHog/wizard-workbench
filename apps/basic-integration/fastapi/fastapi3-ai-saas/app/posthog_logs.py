"""Isolated OpenTelemetry log export for purpose-written PostHog logs."""

import logging

from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

POSTHOG_LOGGER_NAME = "app.posthog_logs"


def configure_posthog_log_exporter(host: str, api_key: str) -> LoggerProvider:
    """Export only records emitted through the dedicated PostHog logger."""
    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)

    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {api_key}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    posthog_logger = logging.getLogger(POSTHOG_LOGGER_NAME)
    posthog_logger.setLevel(logging.INFO)
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    posthog_logger.propagate = False

    return logger_provider


def get_posthog_logger() -> logging.Logger:
    """Return the logger whose records are intentionally exported to PostHog."""
    return logging.getLogger(POSTHOG_LOGGER_NAME)
