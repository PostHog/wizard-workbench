"""Dedicated OpenTelemetry log export for purpose-written PostHog logs."""

import atexit
import logging
import os


def initialize_posthog_logger():
    """Return a logger whose records alone are exported to PostHog."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    for variable_name, value in (
        ("POSTHOG_PROJECT_TOKEN", project_token),
        ("POSTHOG_HOST", host),
    ):
        if not value:
            if os.getenv("ENVIRONMENT") == "production":
                return None
            raise RuntimeError(
                f"{variable_name} variable required by PostHog is missing or "
                f"un-configured, this causes events to be silently missed. This "
                f"error stops appearing once {variable_name} is configured"
            )

    from opentelemetry._logs import set_logger_provider
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    from opentelemetry.sdk.resources import Resource

    logger_provider = LoggerProvider(
        resource=Resource.create({"service.name": "meeting-summarizer"})
    )
    set_logger_provider(logger_provider)

    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    atexit.register(logger_provider.shutdown)

    logger = logging.getLogger("posthog.exported")
    logger.setLevel(logging.INFO)
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    logger.propagate = False
    return logger


posthog_logger = initialize_posthog_logger()
