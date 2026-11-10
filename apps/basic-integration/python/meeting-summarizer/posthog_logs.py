"""Dedicated OpenTelemetry log export for PostHog."""

import atexit
import logging
import os


posthog_log_logger = None


def configure_posthog_log_capture():
    """Configure an isolated logger that exports only integration-owned records."""
    global posthog_log_logger

    if posthog_log_logger is not None:
        return posthog_log_logger

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    if not project_token or not host:
        if os.getenv("ENVIRONMENT", "development").lower() != "production":
            missing_variable = (
                "POSTHOG_PROJECT_TOKEN" if not project_token else "POSTHOG_HOST"
            )
            logging.warning(
                "%s variable required by PostHog is missing or un-configured, this "
                "causes events to be silently missed. This error stops appearing "
                "once %s is configured",
                missing_variable,
                missing_variable,
            )
        return None

    try:
        from opentelemetry._logs import set_logger_provider
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
        from opentelemetry.sdk.resources import Resource
    except ImportError:
        logging.warning(
            "PostHog log capture requires the OpenTelemetry log export packages"
        )
        return None

    logger_provider = LoggerProvider(
        resource=Resource.create({"service.name": "meeting-summarizer"})
    )
    set_logger_provider(logger_provider)
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    posthog_log_logger = logging.getLogger("posthog.meeting_summarizer")
    posthog_log_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    posthog_log_logger.setLevel(logging.INFO)
    posthog_log_logger.propagate = False
    atexit.register(logger_provider.shutdown)
    return posthog_log_logger


def get_posthog_log_logger():
    """Return the isolated exporter logger when log capture is configured."""
    return posthog_log_logger
