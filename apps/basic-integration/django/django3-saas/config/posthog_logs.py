"""OpenTelemetry log export for purpose-written PostHog log lines only."""

import atexit
import logging

posthog_logger = logging.getLogger('posthog.export')
_logs_configured = False


def configure_posthog_logs(api_key: str, host: str) -> None:
    """Export only records emitted through ``posthog_logger`` to PostHog."""
    global _logs_configured

    if _logs_configured:
        return

    from opentelemetry._logs import set_logger_provider
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)
    logger_provider.add_log_record_processor(
        BatchLogRecordProcessor(
            OTLPLogExporter(
                endpoint=f"{host.rstrip('/')}/i/v1/logs",
                headers={'Authorization': f'Bearer {api_key}'},
            )
        )
    )

    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    posthog_logger.setLevel(logging.INFO)
    posthog_logger.propagate = False
    atexit.register(logger_provider.shutdown)
    _logs_configured = True
