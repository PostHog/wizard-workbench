"""PostHog OTLP log export for instrumentation-owned log records only."""

import atexit
import logging
import os


configuration_logger = logging.getLogger(__name__)
posthog_log_logger = logging.getLogger("meeting_summarizer.posthog")
posthog_log_logger.setLevel(logging.INFO)
posthog_log_logger.propagate = False


def _is_production() -> bool:
    """Return whether the application is running in production."""
    return os.getenv("ENVIRONMENT", "").lower() == "production"


def _configure_posthog_logs() -> None:
    """Export only records emitted through the dedicated PostHog logger."""
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")

    if not project_token:
        if not _is_production():
            configuration_logger.warning(
                "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
                "un-configured, this causes events to be silently missed. This error "
                "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
            )
        return

    if not host:
        if not _is_production():
            configuration_logger.warning(
                "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
                "this causes events to be silently missed. This error stops appearing "
                "once POSTHOG_HOST is configured"
            )
        return

    try:
        from opentelemetry._logs import set_logger_provider
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    except ImportError:
        configuration_logger.warning(
            "PostHog log export requires opentelemetry-api, opentelemetry-sdk, and "
            "opentelemetry-exporter-otlp"
        )
        return

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)
    log_exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(log_exporter))
    posthog_log_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)


_configure_posthog_logs()
