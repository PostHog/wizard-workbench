"""OpenTelemetry log export configuration for PostHog."""

import atexit
import logging


POSTHOG_LOGGER_NAME = 'posthog.exporter'


def configure_posthog_logs(project_api_key, host):
    """Export only records emitted through the dedicated PostHog logger."""
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger = logging.getLogger(POSTHOG_LOGGER_NAME)
    if any(getattr(handler, '_posthog_log_exporter', False) for handler in logger.handlers):
        return

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={'Authorization': f'Bearer {project_api_key}'},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    handler = LoggingHandler(logger_provider=logger_provider)
    handler._posthog_log_exporter = True
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    logger.propagate = False
    atexit.register(logger_provider.shutdown)
