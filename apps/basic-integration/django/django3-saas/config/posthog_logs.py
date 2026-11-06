"""Isolated OpenTelemetry log export for purpose-written PostHog logs."""

import atexit
import logging

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

posthog_logger = logging.getLogger("posthog.logs")
posthog_logger.setLevel(logging.INFO)
posthog_logger.propagate = False

_logger_provider = None


def initialize_posthog_logs(project_token, host):
    """Export only records emitted through ``posthog_logger`` to PostHog."""
    global _logger_provider

    if not project_token or not host or _logger_provider:
        return

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(
        BatchLogRecordProcessor(exporter, export_timeout_millis=3000)
    )
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))

    _logger_provider = logger_provider
    atexit.register(logger_provider.shutdown)
