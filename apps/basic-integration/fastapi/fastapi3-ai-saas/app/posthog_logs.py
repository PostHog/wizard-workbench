"""Isolated OpenTelemetry log export for purpose-written PostHog logs."""

import logging

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

from app.config import Settings

logger = logging.getLogger("app.posthog_logs")
logger.setLevel(logging.INFO)
logger.propagate = False

logger_provider: LoggerProvider | None = None


def initialize_posthog_logs(settings: Settings) -> None:
    """Export only this module's dedicated logger when PostHog is configured."""
    global logger_provider

    if logger_provider is not None:
        return

    if not settings.posthog_project_token or not settings.posthog_host:
        return

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {settings.posthog_project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    logger.info("PostHog log export initialized", extra={"component": "log_export"})


def shutdown_posthog_logs() -> None:
    """Flush the dedicated exporter during FastAPI shutdown."""
    if logger_provider is not None:
        logger.info("PostHog log export shutting down", extra={"component": "log_export"})
        logger_provider.shutdown()
