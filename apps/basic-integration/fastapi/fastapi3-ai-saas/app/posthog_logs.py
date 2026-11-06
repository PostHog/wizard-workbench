"""Dedicated OpenTelemetry log export for purpose-written PostHog logs only."""

import logging
from typing import Optional

from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

posthog_logger = logging.getLogger("app.posthog_logs")
posthog_logger.setLevel(logging.INFO)
posthog_logger.propagate = False


def configure_posthog_log_export(
    project_token: Optional[str], host: Optional[str]
) -> Optional["LoggerProvider"]:
    """Export only records written through ``posthog_logger`` to PostHog."""
    if not project_token or not host:
        return None

    try:
        logger_provider = LoggerProvider()
        set_logger_provider(logger_provider)
        exporter = OTLPLogExporter(
            endpoint=f"{host.rstrip('/')}/i/v1/logs",
            headers={"Authorization": f"Bearer {project_token}"},
        )
        logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
        posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
        return logger_provider
    except Exception:
        logging.getLogger(__name__).exception("PostHog log exporter setup failed")
        return None
