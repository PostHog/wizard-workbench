"""OpenTelemetry log export for the purpose-written PostHog application logs."""

import atexit
import logging

from django.conf import settings
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor


posthog_log_provider = LoggerProvider()
posthog_log_exporter = OTLPLogExporter(
    endpoint=f"{settings.POSTHOG_HOST.rstrip('/')}/i/v1/logs",
    headers={"Authorization": f"Bearer {settings.POSTHOG_API_KEY}"},
)
posthog_log_provider.add_log_record_processor(
    BatchLogRecordProcessor(posthog_log_exporter)
)

posthog_log_logger = logging.getLogger("posthog.export")
posthog_log_logger.setLevel(logging.INFO)
posthog_log_logger.propagate = False
posthog_log_logger.addHandler(LoggingHandler(logger_provider=posthog_log_provider))


def shutdown_posthog_log_export() -> None:
    """Flush the isolated log exporter during process shutdown without raising."""
    try:
        posthog_log_provider.shutdown(timeout_millis=3000)
    except Exception:
        pass


atexit.register(shutdown_posthog_log_export)
