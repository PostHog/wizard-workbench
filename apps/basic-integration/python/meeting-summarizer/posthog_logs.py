"""Export purpose-written application lifecycle logs to PostHog via OTLP."""

import atexit
import logging
import os


POSTHOG_LOGGER_NAME = "meeting_summarizer.posthog"
posthog_logs_logger = logging.getLogger(POSTHOG_LOGGER_NAME)
# This logger is intentionally isolated: no existing application log line is exported.
posthog_logs_logger.propagate = False


def _is_development() -> bool:
    """Return whether missing log-export configuration should stop startup."""
    return os.getenv("ENVIRONMENT", "").lower() in {"development", "dev"} or (
        os.getenv("DEBUG", "").lower() == "true"
    )


def _configuration_error(variable_name: str) -> RuntimeError:
    return RuntimeError(
        f"{variable_name} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{variable_name} is configured"
    )


def configure_posthog_logs() -> logging.Logger:
    """Attach an OTLP handler only to this integration's dedicated logger."""
    project_token = os.getenv("POSTHOG_API_KEY")
    host = os.getenv("POSTHOG_HOST")

    if not project_token:
        if _is_development():
            raise _configuration_error("POSTHOG_API_KEY")
        return posthog_logs_logger

    if not host:
        if _is_development():
            raise _configuration_error("POSTHOG_HOST")
        return posthog_logs_logger

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
    posthog_logs_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    posthog_logs_logger.setLevel(logging.INFO)
    atexit.register(logger_provider.shutdown)

    posthog_logs_logger.info("posthog_log_capture_configured")
    return posthog_logs_logger
