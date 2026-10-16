"""Dedicated OpenTelemetry export for log lines added by this integration."""

import logging

POSTHOG_LOGGER_NAME = 'posthog.integration.logs'
posthog_logger = logging.getLogger(POSTHOG_LOGGER_NAME)
posthog_logger.setLevel(logging.INFO)
posthog_logger.propagate = False


def configure_posthog_log_capture(project_token, host):
    """Export only this integration's dedicated logger to PostHog Logs."""
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()

    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={'Authorization': f'Bearer {project_token}'},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))

    return logger_provider
