"""Shared PostHog client for server-side analytics."""

import atexit
import logging
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _warn_missing_posthog_configuration(variable_name):
    """Warn in non-production when an optional PostHog setting is absent."""
    if os.getenv("ENVIRONMENT", "development").lower() == "production":
        return

    logging.warning(
        "%s variable required by PostHog is missing or un-configured, this causes "
        "events to be silently missed. This error stops appearing once %s is configured",
        variable_name,
        variable_name,
    )


def _create_posthog_client():
    """Create the process-wide PostHog client when it is configured."""
    api_key = os.getenv("POSTHOG_API_KEY")
    host = os.getenv("POSTHOG_HOST")
    if not api_key:
        _warn_missing_posthog_configuration("POSTHOG_API_KEY")
        return None
    if not host:
        _warn_missing_posthog_configuration("POSTHOG_HOST")
        return None

    return Posthog(
        api_key,
        host=host,
        enable_exception_autocapture=True,
    )


def _create_posthog_log_logger():
    """Configure an OTLP handler for only the logs this application adds."""
    api_key = os.getenv("POSTHOG_API_KEY")
    host = os.getenv("POSTHOG_HOST")
    if not api_key:
        _warn_missing_posthog_configuration("POSTHOG_API_KEY")
        return None
    if not host:
        _warn_missing_posthog_configuration("POSTHOG_HOST")
        return None

    try:
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    except ImportError:
        logging.warning(
            "PostHog log capture requires opentelemetry-api, opentelemetry-sdk, and "
            "opentelemetry-exporter-otlp"
        )
        return None

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {api_key}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    posthog_log = logging.getLogger("posthog.application_logs")
    posthog_log.setLevel(logging.INFO)
    posthog_log.addHandler(LoggingHandler(logger_provider=logger_provider))
    posthog_log.propagate = False
    atexit.register(logger_provider.shutdown, 3000)
    return posthog_log


posthog_client = _create_posthog_client()
posthog_log = _create_posthog_log_logger()

if posthog_client:
    atexit.register(posthog_client.shutdown)
