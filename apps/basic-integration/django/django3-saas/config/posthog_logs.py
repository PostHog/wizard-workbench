"""OpenTelemetry log export for purpose-written PostHog operational logs."""

import logging

POSTHOG_LOGGER_NAME = 'posthog.export'


def configure_posthog_log_exporter(project_token, host):
    """Export only records emitted to the dedicated PostHog logger."""
    from opentelemetry._logs import set_logger_provider
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)

    exporter = OTLPLogExporter(
        endpoint=f'{host.rstrip("/")}/i/v1/logs',
        headers={'Authorization': f'Bearer {project_token}'},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    posthog_logger = logging.getLogger(POSTHOG_LOGGER_NAME)
    posthog_logger.setLevel(logging.INFO)
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    posthog_logger.propagate = False

    return logger_provider
