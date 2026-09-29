"""Dedicated OpenTelemetry log export for purpose-written PostHog logs."""

import atexit
import logging
import os

from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource


posthog_log = logging.getLogger("meeting_summarizer.posthog")


def configure_posthog_logs() -> None:
    """Export only records emitted through the dedicated PostHog logger."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    if not project_token or not host:
        return

    logger_provider = LoggerProvider(
        resource=Resource.create(
            {
                "service.name": "meeting-summarizer",
                "deployment.environment": os.getenv("ENVIRONMENT", "development"),
            }
        )
    )
    set_logger_provider(logger_provider)

    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    posthog_log.setLevel(logging.INFO)
    posthog_log.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)
