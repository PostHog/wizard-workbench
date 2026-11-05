"""Dedicated OpenTelemetry log export for PostHog."""

import atexit
import logging
import os

from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor


def _missing_configuration(variable_name):
    """Return whether PostHog logging should be disabled for a missing setting."""
    if os.getenv("APP_ENV", "development").lower() == "production":
        return True

    raise RuntimeError(
        f"{variable_name} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{variable_name} is configured"
    )


def _configure_posthog_logs():
    """Create a logger that exports only purpose-written records to PostHog."""
    logger = logging.getLogger("posthog.logs")
    logger.propagate = False

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    if not project_token:
        _missing_configuration("POSTHOG_PROJECT_TOKEN")
        return logger

    host = os.getenv("POSTHOG_HOST")
    if not host:
        _missing_configuration("POSTHOG_HOST")
        return logger

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    atexit.register(logger_provider.shutdown)

    logger.setLevel(logging.INFO)
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    return logger


posthog_logs = _configure_posthog_logs()
