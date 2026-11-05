"""Dedicated OpenTelemetry log export for PostHog instrumentation logs."""

import atexit
import logging
import os

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource

from posthog_client import posthog_client


posthog_logger = logging.getLogger("posthog.instrumentation")
posthog_logger.setLevel(logging.INFO)
posthog_logger.propagate = False


def _configure_posthog_log_export() -> None:
    """Export only records deliberately sent through ``posthog_logger``."""
    if posthog_client is None:
        return

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    if not project_token or not host:
        return

    logger_provider = LoggerProvider(
        resource=Resource.create({"service.name": "meeting-summarizer"})
    )

    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)


_configure_posthog_log_export()
