"""OpenTelemetry log export for purpose-written PostHog application logs."""

import logging

from app.config import Settings

POSTHOG_LOGGER_NAME = "app.posthog_export"
_posthog_logger = logging.getLogger(POSTHOG_LOGGER_NAME)
_logger_provider = None
_logging_handler = None


def configure_posthog_logs(settings: Settings) -> None:
    """Export only records emitted through the dedicated PostHog logger."""
    global _logger_provider, _logging_handler

    if _logger_provider is not None or not settings.posthog_project_token or not settings.posthog_host:
        return

    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {settings.posthog_project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    logging_handler = LoggingHandler(logger_provider=logger_provider)
    _posthog_logger.setLevel(logging.INFO)
    _posthog_logger.propagate = False
    _posthog_logger.addHandler(logging_handler)
    _logger_provider = logger_provider
    _logging_handler = logging_handler


def get_posthog_logger() -> logging.Logger:
    """Return the dedicated logger whose records are exported to PostHog."""
    return _posthog_logger


def shutdown_posthog_logs() -> None:
    """Flush the dedicated OpenTelemetry log provider during application shutdown."""
    global _logger_provider, _logging_handler

    if _logger_provider is not None:
        if _logging_handler is not None:
            _posthog_logger.removeHandler(_logging_handler)
        _logger_provider.shutdown()
        if _logging_handler is not None:
            _logging_handler.close()
        _logger_provider = None
        _logging_handler = None
