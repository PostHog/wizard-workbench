"""Isolated OpenTelemetry log export for purpose-written PostHog logs."""

import atexit
import logging
import os
from typing import Optional


_posthog_logger: Optional[logging.Logger] = None
_log_provider = None


def _is_production() -> bool:
    return os.getenv("APP_ENV", os.getenv("ENVIRONMENT", "")).lower() == "production"


def initialize_posthog_logs() -> Optional[logging.Logger]:
    """Configure the dedicated logger that exports only PostHog log records."""
    global _posthog_logger, _log_provider

    if _posthog_logger is not None:
        return _posthog_logger

    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    if not project_token or not host:
        if not _is_production():
            missing_variable = "POSTHOG_PROJECT_TOKEN" if not project_token else "POSTHOG_HOST"
            logging.warning(
                "%s variable required by PostHog is missing or un-configured, this causes "
                "events to be silently missed. This error stops appearing once %s is configured",
                missing_variable,
                missing_variable,
            )
        return None

    try:
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    except ImportError:
        logging.warning(
            "PostHog log export is not configured because OpenTelemetry log packages are unavailable"
        )
        return None

    _log_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    _log_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    _posthog_logger = logging.getLogger("posthog.logs")
    _posthog_logger.setLevel(logging.INFO)
    _posthog_logger.propagate = False
    _posthog_logger.addHandler(LoggingHandler(logger_provider=_log_provider))
    atexit.register(_log_provider.shutdown, 3000)
    return _posthog_logger


def get_posthog_logger() -> Optional[logging.Logger]:
    """Return the dedicated PostHog logger, if log export was configured."""
    return _posthog_logger
