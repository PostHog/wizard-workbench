"""Dedicated OpenTelemetry log export for PostHog instrumentation logs."""

import atexit
import logging
import os
from typing import Optional


POSTHOG_LOGGER_NAME = "meeting_summarizer.posthog"


def configure_posthog_logs() -> logging.Logger:
    """Return a logger that exports only instrumentation added by this module."""
    logger = logging.getLogger(POSTHOG_LOGGER_NAME)
    logger.setLevel(logging.INFO)
    logger.propagate = False

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    if not project_token or not host:
        logger.addHandler(logging.NullHandler())
        return logger

    try:
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    except ImportError:
        logging.getLogger(__name__).warning(
            "OpenTelemetry log export is unavailable; install the required "
            "OpenTelemetry packages to send PostHog logs"
        )
        logger.addHandler(logging.NullHandler())
        return logger

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)
    return logger


posthog_log = configure_posthog_logs()
