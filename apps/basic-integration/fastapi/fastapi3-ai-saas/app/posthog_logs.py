"""Dedicated OpenTelemetry log export for PostHog."""

import logging

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

from app.config import Settings

POSTHOG_LOGGER_NAME = "app.posthog_export"
_posthog_logger = logging.getLogger(POSTHOG_LOGGER_NAME)
_posthog_logger.setLevel(logging.INFO)
_posthog_logger.propagate = False
_logger_provider: LoggerProvider | None = None


def get_posthog_logger() -> logging.Logger:
    """Return the logger whose records are eligible for PostHog export."""
    return _posthog_logger


def configure_posthog_log_export(settings: Settings) -> logging.Logger | None:
    """Export only records emitted through the dedicated PostHog logger."""
    global _logger_provider

    if _logger_provider is not None:
        return _posthog_logger

    required_settings = (
        ("POSTHOG_PROJECT_API_KEY", settings.posthog_project_api_key),
        ("POSTHOG_HOST", settings.posthog_host),
    )
    for variable_name, value in required_settings:
        if value:
            continue
        if settings.debug:
            raise RuntimeError(
                f"{variable_name} variable required by PostHog is missing or "
                f"un-configured, this causes events to be silently missed. This "
                f"error stops appearing once {variable_name} is configured"
            )
        return None

    _logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {settings.posthog_project_api_key}"},
    )
    _logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    _posthog_logger.addHandler(LoggingHandler(logger_provider=_logger_provider))
    return _posthog_logger


def shutdown_posthog_log_export() -> None:
    """Flush and stop the dedicated PostHog log exporter on application exit."""
    if _logger_provider is not None:
        _logger_provider.shutdown()
