"""Dedicated OpenTelemetry log export for purpose-written PostHog logs."""

import logging

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

POSTHOG_LOGGER_NAME = "app.posthog"


def configure_posthog_log_export(api_key: str, host: str) -> LoggerProvider:
    """Export only records written to the dedicated PostHog logger."""
    logger_provider = LoggerProvider()

    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {api_key}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    logger = logging.getLogger(POSTHOG_LOGGER_NAME)
    logger.setLevel(logging.INFO)
    logger.propagate = False
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))

    return logger_provider
