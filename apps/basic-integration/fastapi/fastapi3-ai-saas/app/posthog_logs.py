"""Isolated OpenTelemetry log export for purpose-written PostHog logs."""

import logging

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

POSTHOG_LOGGER_NAME = "acme_ai.posthog_logs"


def get_posthog_logger() -> logging.Logger:
    """Return the logger whose records are explicitly exported to PostHog."""
    return logging.getLogger(POSTHOG_LOGGER_NAME)


def configure_posthog_logs(host: str, project_api_key: str) -> LoggerProvider:
    """Export only records from the dedicated PostHog logger over OTLP."""
    logger_provider = LoggerProvider()

    otlp_exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_api_key}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(otlp_exporter))

    posthog_logger = get_posthog_logger()
    posthog_logger.setLevel(logging.INFO)
    posthog_logger.propagate = False
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))

    return logger_provider
