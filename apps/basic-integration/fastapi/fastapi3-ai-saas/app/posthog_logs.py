"""Dedicated OpenTelemetry log export for PostHog."""

import logging

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

from app.config import Settings

_posthog_log_provider: LoggerProvider | None = None
_posthog_log_logger = logging.getLogger("acme_ai.posthog")
_posthog_log_logger.propagate = False


def initialize_posthog_logs(settings: Settings) -> logging.Logger:
    """Configure PostHog export for only the dedicated application logger."""
    global _posthog_log_provider

    if _posthog_log_provider is not None:
        return _posthog_log_logger

    if not settings.posthog_project_token:
        _raise_for_missing_configuration("POSTHOG_PROJECT_TOKEN", settings.debug)
        return _posthog_log_logger

    if not settings.posthog_host:
        _raise_for_missing_configuration("POSTHOG_HOST", settings.debug)
        return _posthog_log_logger

    _posthog_log_provider = LoggerProvider()

    exporter = OTLPLogExporter(
        endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {settings.posthog_project_token}"},
    )
    _posthog_log_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    _posthog_log_logger.setLevel(logging.INFO)
    _posthog_log_logger.addHandler(LoggingHandler(logger_provider=_posthog_log_provider))
    _posthog_log_logger.propagate = False
    return _posthog_log_logger


def get_posthog_log_logger() -> logging.Logger:
    """Return the dedicated logger whose lines are eligible for PostHog export."""
    return _posthog_log_logger


def shutdown_posthog_logs() -> None:
    """Flush and close the dedicated log exporter during application shutdown."""
    if _posthog_log_provider is not None:
        _posthog_log_provider.force_flush()
        _posthog_log_provider.shutdown()


def _raise_for_missing_configuration(variable_name: str, debug: bool) -> None:
    if debug:
        raise RuntimeError(
            f"{variable_name} variable required by PostHog is missing or un-configured, "
            f"this causes events to be silently missed. This error stops appearing once "
            f"{variable_name} is configured"
        )
