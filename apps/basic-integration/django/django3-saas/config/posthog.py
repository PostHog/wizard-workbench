"""Process-wide PostHog client for Django request analytics."""

import atexit
import logging
import os

from posthog import Posthog

logger = logging.getLogger(__name__)
posthog_logs_logger = logging.getLogger("posthog.export")
posthog_logs_logger.setLevel(logging.INFO)
posthog_logs_logger.propagate = False

POSTHOG_PROJECT_TOKEN = os.environ.get("POSTHOG_PROJECT_TOKEN")
POSTHOG_HOST = os.environ.get("POSTHOG_HOST")
_is_debug = os.environ.get("DEBUG", "True").lower() in ("true", "1", "yes")

_missing_settings = {
    "POSTHOG_PROJECT_TOKEN": POSTHOG_PROJECT_TOKEN,
    "POSTHOG_HOST": POSTHOG_HOST,
}

if not all(_missing_settings.values()):
    if _is_debug:
        for setting_name, value in _missing_settings.items():
            if not value:
                logger.warning(
                    "%s variable required by PostHog is missing or un-configured, "
                    "this causes events to be silently missed. This error stops "
                    "appearing once %s is configured",
                    setting_name,
                    setting_name,
                )
    posthog_client = None
else:
    posthog_client = Posthog(
        project_api_key=POSTHOG_PROJECT_TOKEN,
        host=POSTHOG_HOST,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)

    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    posthog_log_provider = LoggerProvider()
    posthog_log_exporter = OTLPLogExporter(
        endpoint=f"{POSTHOG_HOST.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {POSTHOG_PROJECT_TOKEN}"},
    )
    posthog_log_provider.add_log_record_processor(
        BatchLogRecordProcessor(posthog_log_exporter)
    )
    posthog_logs_logger.addHandler(
        LoggingHandler(logger_provider=posthog_log_provider)
    )
    atexit.register(posthog_log_provider.shutdown)
