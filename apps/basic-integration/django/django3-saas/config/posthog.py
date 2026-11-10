"""PostHog client configured once for the Django process."""

import atexit
import logging

from django.conf import settings
from posthog import Posthog

logger = logging.getLogger(__name__)
posthog_logs_logger = logging.getLogger("posthog.application")
posthog_logs_logger.setLevel(logging.INFO)
posthog_client = None

if not settings.POSTHOG_PROJECT_TOKEN:
    if settings.DEBUG:
        logger.warning(
            "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
            "un-configured, this causes events to be silently missed. This error "
            "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
        )
elif not settings.POSTHOG_HOST:
    if settings.DEBUG:
        logger.warning(
            "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
            "this causes events to be silently missed. This error stops appearing "
            "once POSTHOG_HOST is configured"
        )
else:
    from opentelemetry._logs import set_logger_provider
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    posthog_client = Posthog(
        settings.POSTHOG_PROJECT_TOKEN,
        host=settings.POSTHOG_HOST,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)

    posthog_log_provider = LoggerProvider()
    set_logger_provider(posthog_log_provider)
    posthog_log_provider.add_log_record_processor(
        BatchLogRecordProcessor(
            OTLPLogExporter(
                endpoint=f"{settings.POSTHOG_HOST.rstrip('/')}/i/v1/logs",
                headers={"Authorization": f"Bearer {settings.POSTHOG_PROJECT_TOKEN}"},
            )
        )
    )
    posthog_logs_logger.addHandler(
        LoggingHandler(logger_provider=posthog_log_provider)
    )
    atexit.register(posthog_log_provider.shutdown)
