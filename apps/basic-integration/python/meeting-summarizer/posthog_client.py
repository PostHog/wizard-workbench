"""Shared PostHog client configuration for the application."""

import atexit
import logging
import os
from typing import Optional

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _is_development() -> bool:
    """Return whether the application is running in a development/debug mode."""
    return any(
        os.getenv(name, "").lower() in {"1", "true", "development", "debug"}
        for name in ("DEBUG", "ENVIRONMENT", "PYTHON_ENV")
    )


def _missing_configuration_error(variable_name: str) -> RuntimeError:
    return RuntimeError(
        f"{variable_name} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{variable_name} is configured"
    )


posthog_logger = logging.getLogger("meeting_summarizer.posthog_logs")


def _configure_posthog_logs(project_token: str, host: str) -> None:
    """Export only records emitted through the dedicated PostHog logger."""
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    posthog_logger.setLevel(logging.INFO)
    atexit.register(logger_provider.shutdown)
    posthog_logger.propagate = False


def initialize_posthog() -> Optional[Posthog]:
    """Create the process-wide PostHog client when configured."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    for variable_name, value in (
        ("POSTHOG_PROJECT_TOKEN", project_token),
        ("POSTHOG_HOST", host),
    ):
        if not value:
            if _is_development():
                raise _missing_configuration_error(variable_name)
            return None

    client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    _configure_posthog_logs(project_token, host)
    atexit.register(client.shutdown)
    return client


posthog_client = initialize_posthog()
