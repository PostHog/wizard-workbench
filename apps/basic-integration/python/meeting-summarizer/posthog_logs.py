"""Dedicated OpenTelemetry export for PostHog application logs."""

import atexit
import logging
import os
from typing import Optional

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor


LOGGER_NAME = "meeting_summarizer.posthog_logs"


def _warn_if_unconfigured(variable_name: str) -> None:
    """Warn in non-production when log export configuration is missing."""
    if os.getenv("APP_ENV") != "production":
        logging.warning(
            "%s variable required by PostHog is missing or un-configured, "
            "this causes events to be silently missed. This error stops "
            "appearing once %s is configured",
            variable_name,
            variable_name,
        )


def configure_posthog_logs() -> logging.Logger:
    """Configure OTLP export for only this integration's dedicated logger."""
    logger = logging.getLogger(LOGGER_NAME)
    logger.propagate = False

    api_key = os.getenv("POSTHOG_API_KEY")
    host = os.getenv("POSTHOG_HOST")
    if not api_key:
        _warn_if_unconfigured("POSTHOG_API_KEY")
        return logger
    if not host:
        _warn_if_unconfigured("POSTHOG_HOST")
        return logger

    try:
        logger_provider = LoggerProvider()
        exporter = OTLPLogExporter(
            endpoint=f"{host.rstrip('/')}/i/v1/logs",
            headers={"Authorization": f"Bearer {api_key}"},
        )
        logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
        logger.addHandler(LoggingHandler(logger_provider=logger_provider))
        logger.setLevel(logging.INFO)
        atexit.register(logger_provider.shutdown)
    except Exception:
        logging.exception("Unable to configure PostHog log export")

    return logger


posthog_logs_logger: Optional[logging.Logger] = configure_posthog_logs()
