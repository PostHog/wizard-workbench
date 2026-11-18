"""Isolated OpenTelemetry log export for PostHog."""

import atexit
import logging
import os


posthog_log = logging.getLogger("posthog.exporter")
posthog_log.setLevel(logging.INFO)
posthog_log.propagate = False
_log_provider = None


def _is_production():
    return os.getenv("ENVIRONMENT", "").lower() == "production"


def _missing_configuration_warning(variable_name):
    if not _is_production():
        logging.warning(
            "%s variable required by PostHog is missing or un-configured, this causes "
            "events to be silently missed. This error stops appearing once %s is configured",
            variable_name,
            variable_name,
        )


def configure_posthog_logs():
    """Export only records created through the dedicated PostHog logger."""
    global _log_provider

    if _log_provider:
        return posthog_log

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    if not project_token:
        _missing_configuration_warning("POSTHOG_PROJECT_TOKEN")
        return posthog_log
    if not host:
        _missing_configuration_warning("POSTHOG_HOST")
        return posthog_log

    try:
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
        from opentelemetry.sdk.resources import Resource
    except ImportError:
        logging.warning(
            "PostHog log export is unavailable until OpenTelemetry log packages are installed"
        )
        return posthog_log

    _log_provider = LoggerProvider(
        resource=Resource.create({
            "service.name": "meeting-summarizer",
            "deployment.environment": os.getenv("ENVIRONMENT", "development"),
        })
    )
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    _log_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    posthog_log.addHandler(LoggingHandler(logger_provider=_log_provider))
    atexit.register(_log_provider.shutdown, timeout_millis=3000)
    return posthog_log
