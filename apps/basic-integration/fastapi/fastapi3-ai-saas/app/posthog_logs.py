"""Dedicated PostHog log export for application-authored lifecycle logs."""

import logging

from app.config import Settings

posthog_logs_logger = logging.getLogger("posthog.app_logs")
posthog_logs_logger.setLevel(logging.INFO)
posthog_logs_logger.propagate = False


def configure_posthog_log_exporter(settings: Settings):
    """Attach an OTLP handler only to the logger owned by this integration."""
    if not settings.posthog_project_token or not settings.posthog_host:
        return None

    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    otlp_exporter = OTLPLogExporter(
        endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {settings.posthog_project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(otlp_exporter))
    posthog_logs_logger.addHandler(LoggingHandler(logger_provider=logger_provider))

    return logger_provider
