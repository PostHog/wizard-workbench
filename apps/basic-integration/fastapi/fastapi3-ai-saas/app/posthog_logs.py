"""Isolated OpenTelemetry log export for PostHog."""

import logging

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

posthog_log = logging.getLogger("posthog.exporter")
posthog_log.addHandler(logging.NullHandler())
posthog_log.setLevel(logging.INFO)
posthog_log.propagate = False

_logger_provider: LoggerProvider | None = None


def configure_posthog_logs(project_token: str, host: str) -> None:
    """Export only records emitted by ``posthog_log`` to PostHog Logs."""
    global _logger_provider

    if _logger_provider is not None:
        return

    _logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    _logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    posthog_log.addHandler(LoggingHandler(logger_provider=_logger_provider))


def shutdown_posthog_logs() -> None:
    """Flush and stop the isolated PostHog Logs exporter."""
    if _logger_provider is not None:
        _logger_provider.shutdown()
