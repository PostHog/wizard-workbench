"""Isolated OpenTelemetry log export for purpose-written PostHog logs."""

import atexit
import logging
import os

posthog_log = logging.getLogger("posthog_export")
posthog_log.setLevel(logging.INFO)
posthog_log.propagate = False

_configured = False


def configure_posthog_log_exporter():
    """Attach an OTLP handler only to this integration's dedicated logger."""
    global _configured
    if _configured:
        return

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    if not project_token or not host:
        return

    try:
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    except ImportError:
        logging.getLogger(__name__).warning(
            "OpenTelemetry log packages are not installed; PostHog log export is disabled"
        )
        return

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    posthog_log.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)
    _configured = True
