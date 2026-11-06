"""OpenTelemetry log export limited to PostHog-specific application logs."""

import atexit
import logging
import os

from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

logger = logging.getLogger("posthog.exporter")
logger.setLevel(logging.INFO)

_logger_provider = None


def initialize_posthog_logs():
    """Configure OTLP export for only the dedicated PostHog logger."""
    global _logger_provider

    if _logger_provider is not None:
        return _logger_provider

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    if not project_token or not host:
        missing_variable = "POSTHOG_PROJECT_TOKEN" if not project_token else "POSTHOG_HOST"
        if os.getenv("ENVIRONMENT", "").lower() != "production":
            logging.getLogger(__name__).warning(
                "%s variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops "
                "appearing once %s is configured",
                missing_variable,
                missing_variable,
            )
        return None

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))

    _logger_provider = logger_provider
    atexit.register(shutdown_posthog_logs)
    return logger_provider


def shutdown_posthog_logs():
    """Flush queued log records only while the server is shutting down."""
    if _logger_provider is None:
        return

    try:
        _logger_provider.force_flush(timeout_millis=3000)
    except Exception:
        logging.getLogger(__name__).exception("Unable to flush PostHog log records")
