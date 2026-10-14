"""Dedicated OpenTelemetry log export for PostHog."""

import logging

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

POSTHOG_LOGGER = logging.getLogger("acme_ai.posthog")


def configure_posthog_logs(project_token: str, host: str) -> LoggerProvider:
    """Export only the purpose-written PostHog logger's records over OTLP."""
    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    POSTHOG_LOGGER.addHandler(LoggingHandler(logger_provider=logger_provider))
    POSTHOG_LOGGER.setLevel(logging.INFO)
    POSTHOG_LOGGER.propagate = False
    return logger_provider


def shutdown_posthog_logs(logger_provider: LoggerProvider) -> None:
    """Flush and close the dedicated OTLP logging pipeline."""
    logger_provider.force_flush()
    logger_provider.shutdown()
