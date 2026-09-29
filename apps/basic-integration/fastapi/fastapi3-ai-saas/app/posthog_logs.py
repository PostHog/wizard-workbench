"""Dedicated OpenTelemetry log export for PostHog."""

import logging

from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

from app.config import Settings

POSTHOG_LOGGER_NAME = "acme_ai.posthog"
posthog_logger = logging.getLogger(POSTHOG_LOGGER_NAME)
posthog_logger.setLevel(logging.INFO)
posthog_logger.propagate = False

_logger_provider: LoggerProvider | None = None


def configure_posthog_logs(settings: Settings) -> LoggerProvider | None:
    """Send only records written to the dedicated PostHog logger to PostHog."""
    global _logger_provider

    if not settings.posthog_project_token or not settings.posthog_host:
        return None

    if _logger_provider:
        return _logger_provider

    _logger_provider = LoggerProvider()
    set_logger_provider(_logger_provider)

    exporter = OTLPLogExporter(
        endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {settings.posthog_project_token}"},
    )
    _logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    posthog_logger.addHandler(LoggingHandler(logger_provider=_logger_provider))

    return _logger_provider


def shutdown_posthog_logs(logger_provider: LoggerProvider | None) -> None:
    """Flush dedicated PostHog log records before the application exits."""
    if logger_provider:
        logger_provider.shutdown()
