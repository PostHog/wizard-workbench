"""Dedicated PostHog log export for the MCP server."""

import atexit
import logging
import os
import sys

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor


posthog_logger = logging.getLogger("notes_server.posthog")
posthog_logger.setLevel(logging.INFO)
posthog_logger.propagate = False
_logger_provider: LoggerProvider | None = None


def _missing_configuration_warning(variable_name: str) -> None:
    print(
        f"{variable_name} variable required by PostHog is missing or "
        "un-configured, this causes events to be silently missed. This error "
        f"stops appearing once {variable_name} is configured",
        file=sys.stderr,
    )


def _configure_posthog_logs() -> None:
    global _logger_provider

    api_key = os.getenv("POSTHOG_API_KEY")
    host = os.getenv("POSTHOG_HOST")
    if not api_key:
        _missing_configuration_warning("POSTHOG_API_KEY")
        return
    if not host:
        _missing_configuration_warning("POSTHOG_HOST")
        return

    logger_provider = LoggerProvider()
    logger_provider.add_log_record_processor(
        BatchLogRecordProcessor(
            OTLPLogExporter(
                endpoint=f"{host.rstrip('/')}/i/v1/logs",
                headers={"Authorization": f"Bearer {api_key}"},
            )
        )
    )
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    _logger_provider = logger_provider
    atexit.register(shutdown_logs)


def shutdown_logs() -> None:
    """Flush only the log records emitted by this integration at shutdown."""
    if _logger_provider:
        _logger_provider.shutdown()


_configure_posthog_logs()
