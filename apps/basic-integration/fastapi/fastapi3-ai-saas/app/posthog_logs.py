"""Isolated OpenTelemetry log export for PostHog-authored application logs."""

import logging

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor


def configure_posthog_log_export(
    posthog_host: str, project_token: str
) -> tuple[logging.Logger, LoggerProvider]:
    """Export only records emitted through the dedicated PostHog logger."""
    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
        timeout=3,
    )
    logger_provider.add_log_record_processor(
        BatchLogRecordProcessor(exporter, export_timeout_millis=3000)
    )

    logger = logging.getLogger("app.posthog_logs")
    logger.setLevel(logging.INFO)
    logger.propagate = False
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))

    return logger, logger_provider
