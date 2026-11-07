"""Isolated OpenTelemetry log export for PostHog-added application logs."""

import atexit
import logging
import os
from typing import Optional


EXPORTER_LOGGER_NAME = "meeting_summarizer.posthog"


def _missing_configuration_warning(variable: str) -> None:
    """Warn outside production when log export configuration is incomplete."""
    if os.getenv("ENVIRONMENT") != "production":
        logging.warning(
            "%s variable required by PostHog is missing or un-configured, "
            "this causes events to be silently missed. This error stops "
            "appearing once %s is configured",
            variable,
            variable,
        )


def _create_posthog_logger() -> Optional[logging.Logger]:
    """Create a logger that exports only records emitted through this module."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    if not project_token:
        _missing_configuration_warning("POSTHOG_PROJECT_TOKEN")
        return None
    if not host:
        _missing_configuration_warning("POSTHOG_HOST")
        return None

    try:
        from opentelemetry._logs import set_logger_provider
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    except ImportError:
        logging.warning(
            "PostHog log export requires OpenTelemetry packages; logs will remain local until installed"
        )
        return None

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    logger = logging.getLogger(EXPORTER_LOGGER_NAME)
    logger.setLevel(logging.INFO)
    logger.propagate = False
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)
    return logger


posthog_logger: Optional[logging.Logger] = None


def configure_posthog_logs() -> Optional[logging.Logger]:
    """Configure asynchronous PostHog export after application logging is ready."""
    global posthog_logger
    if posthog_logger is None:
        posthog_logger = _create_posthog_logger()
    return posthog_logger
