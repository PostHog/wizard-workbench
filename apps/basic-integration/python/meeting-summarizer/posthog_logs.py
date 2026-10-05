"""Dedicated OpenTelemetry export for logs added by this integration."""

import atexit
import logging
import os


posthog_logs = logging.getLogger("posthog.export")
posthog_logs.setLevel(logging.INFO)


def configure_posthog_log_export():
    """Export only records written through ``posthog_logs`` when configured."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    for variable_name, value in (
        ("POSTHOG_PROJECT_TOKEN", project_token),
        ("POSTHOG_HOST", host),
    ):
        if not value:
            if os.getenv("POSTHOG_DEBUG", "").lower() == "true":
                raise RuntimeError(
                    f"{variable_name} variable required by PostHog is missing or "
                    "un-configured, this causes events to be silently missed. This "
                    f"error stops appearing once {variable_name} is configured"
                )
            return

    if posthog_logs.handlers:
        return

    from opentelemetry._logs import set_logger_provider
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    posthog_logs.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)
