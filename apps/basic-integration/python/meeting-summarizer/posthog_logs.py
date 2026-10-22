"""Dedicated OpenTelemetry log export for PostHog."""

import atexit
import logging
import os
from typing import Optional

from dotenv import load_dotenv
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

load_dotenv()

POSTHOG_LOGGER_NAME = "meeting_summarizer.posthog"


def _is_debug() -> bool:
    return os.getenv("POSTHOG_DEBUG", "false").lower() == "true"


def _missing_configuration_error(variable_name: str) -> RuntimeError:
    return RuntimeError(
        f"{variable_name} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{variable_name} is configured"
    )


def _configure_posthog_log_capture() -> tuple[logging.Logger, Optional[LoggerProvider]]:
    """Create a non-propagating logger that exports only integration-owned lines."""
    logger = logging.getLogger(POSTHOG_LOGGER_NAME)
    logger.setLevel(logging.INFO)
    logger.propagate = False

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    for variable_name, value in (
        ("POSTHOG_PROJECT_TOKEN", project_token),
        ("POSTHOG_HOST", host),
    ):
        if value:
            continue
        if _is_debug():
            raise _missing_configuration_error(variable_name)
        logger.addHandler(logging.NullHandler())
        return logger, None

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    return logger, logger_provider


posthog_logger, _logger_provider = _configure_posthog_log_capture()


def shutdown() -> None:
    """Flush integration-owned log records before process exit."""
    if _logger_provider:
        _logger_provider.shutdown()


atexit.register(shutdown)
