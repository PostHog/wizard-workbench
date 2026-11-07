"""Dedicated OpenTelemetry log export for PostHog."""

import logging
from functools import lru_cache

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource

from app.config import get_settings

configuration_logger = logging.getLogger(__name__)


@lru_cache
def get_posthog_log_provider() -> LoggerProvider | None:
    """Create the isolated provider that exports only this module's logger."""
    settings = get_settings()
    missing_variables = [
        variable
        for variable, value in (
            ("POSTHOG_API_KEY", settings.posthog_api_key),
            ("POSTHOG_HOST", settings.posthog_host),
        )
        if not value
    ]

    if missing_variables:
        if settings.debug:
            for variable in missing_variables:
                configuration_logger.warning(
                    "%s variable required by PostHog is missing or un-configured, "
                    "this causes events to be silently missed. This error stops "
                    "appearing once %s is configured",
                    variable,
                    variable,
                )
        return None

    provider = LoggerProvider(
        resource=Resource.create({"service.name": settings.app_name})
    )
    exporter = OTLPLogExporter(
        endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {settings.posthog_api_key}"},
    )
    provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    return provider


@lru_cache
def get_posthog_log_logger() -> logging.Logger | None:
    """Return the dedicated logger whose records are safe to export."""
    provider = get_posthog_log_provider()
    if provider is None:
        return None

    posthog_logger = logging.getLogger("app.posthog_logs")
    posthog_logger.setLevel(logging.INFO)
    posthog_logger.propagate = False
    posthog_logger.addHandler(LoggingHandler(logger_provider=provider))
    return posthog_logger
