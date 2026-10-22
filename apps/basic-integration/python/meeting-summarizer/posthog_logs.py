"""Dedicated OpenTelemetry log export for PostHog."""

import atexit
import logging
import os

from dotenv import load_dotenv

load_dotenv()

posthog_log = logging.getLogger("posthog_export")
posthog_log.setLevel(logging.INFO)
posthog_log.propagate = False


def _posthog_debug_enabled() -> bool:
    """Return whether missing PostHog configuration should stop startup."""
    return os.getenv("POSTHOG_DEBUG", "").lower() in {"1", "true", "yes"}


def _missing_configuration_error(variable_name: str) -> RuntimeError:
    return RuntimeError(
        f"{variable_name} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{variable_name} is configured"
    )


def _configure_posthog_log_export() -> None:
    """Export only records emitted through the dedicated PostHog logger."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    if not project_token:
        if _posthog_debug_enabled():
            raise _missing_configuration_error("POSTHOG_PROJECT_TOKEN")
        return

    if not host:
        if _posthog_debug_enabled():
            raise _missing_configuration_error("POSTHOG_HOST")
        return

    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    posthog_log.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)


_configure_posthog_log_export()
