"""Isolated OpenTelemetry log export for purpose-written PostHog logs."""

import atexit
import logging
import os


posthog_log = logging.getLogger("posthog.exporter.project_lifecycle")
posthog_log.setLevel(logging.INFO)
posthog_log.propagate = False


def configure_posthog_logs() -> None:
    """Export only the dedicated PostHog project-lifecycle logger."""
    project_api_key = os.environ.get("POSTHOG_PROJECT_API_KEY")
    host = os.environ.get("POSTHOG_HOST")
    if not project_api_key or not host:
        return

    from opentelemetry._logs import set_logger_provider
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)

    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_api_key}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    posthog_log.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)
