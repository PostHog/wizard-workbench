"""Isolated OpenTelemetry export for purpose-written PostHog logs."""

import logging

from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

LOGGER_NAME = "posthog.logs"


def configure_posthog_log_exporter(
    posthog_api_key: str | None, posthog_host: str | None
) -> LoggerProvider | None:
    """Export only records emitted through this integration's dedicated logger."""
    if not posthog_api_key or not posthog_host:
        return None

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)
    exporter = OTLPLogExporter(
        endpoint=f"{posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {posthog_api_key}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    logger = logging.getLogger(LOGGER_NAME)
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    logger.setLevel(logging.INFO)
    logger.propagate = False

    return logger_provider
