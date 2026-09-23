"""Isolated OpenTelemetry log export for PostHog."""

import logging

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

posthog_logger = logging.getLogger("app.posthog_export")
posthog_logger.setLevel(logging.INFO)
posthog_logger.propagate = False

_logger_provider: LoggerProvider | None = None


def configure_posthog_log_exporter(host: str, project_token: str) -> LoggerProvider:
    """Configure the dedicated logger to export only integration-owned records."""
    global _logger_provider

    if _logger_provider is not None:
        return _logger_provider

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    _logger_provider = logger_provider
    return logger_provider
