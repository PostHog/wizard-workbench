"""Isolated OpenTelemetry log export for purpose-written PostHog logs."""

import atexit
import logging
import os


POSTHOG_LOGGER_NAME = "posthog_exporter"


def _is_production() -> bool:
    return os.getenv("ENVIRONMENT", "").lower() in {"prod", "production"}


def _missing_configuration(variable_name: str) -> None:
    if not _is_production():
        raise RuntimeError(
            f"{variable_name} variable required by PostHog is missing or un-configured, "
            f"this causes events to be silently missed. This error stops appearing once "
            f"{variable_name} is configured"
        )


def configure_posthog_logging() -> logging.Logger:
    """Return a logger whose new records alone are exported to PostHog."""
    logger = logging.getLogger(POSTHOG_LOGGER_NAME)
    logger.setLevel(logging.INFO)
    logger.propagate = False

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    if not project_token:
        _missing_configuration("POSTHOG_PROJECT_TOKEN")
        return logger

    host = os.getenv("POSTHOG_HOST")
    if not host:
        _missing_configuration("POSTHOG_HOST")
        return logger

    from opentelemetry._logs import set_logger_provider
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)
    return logger
