"""Dedicated OpenTelemetry log export for instrumentation added by this project."""

import logging
from dataclasses import dataclass


posthog_logger = logging.getLogger("app.posthog")


@dataclass
class PostHogLogCapture:
    """Keep the dedicated logger provider available for graceful shutdown."""

    logger_provider: object


def configure_posthog_log_capture(
    project_token: str,
    host: str,
) -> PostHogLogCapture:
    """Export only records emitted through the dedicated PostHog logger."""
    from opentelemetry._logs import set_logger_provider
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    posthog_logger.setLevel(logging.INFO)
    posthog_logger.propagate = False
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))

    return PostHogLogCapture(logger_provider=logger_provider)
