"""OpenTelemetry log export for the dedicated PostHog application logger."""

import atexit
import logging


LOGGER_NAME = 'posthog.application_logs'


def configure_posthog_logs(project_token, host, debug=False):
    """Configure isolated OTLP export without changing existing log handlers."""
    if not project_token or not host:
        return None

    try:
        from opentelemetry._logs import set_logger_provider
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    except ImportError:
        if debug:
            logging.getLogger(__name__).warning(
                'OpenTelemetry packages required by PostHog log capture are not installed.'
            )
        return None

    logger_provider = LoggerProvider()
    set_logger_provider(logger_provider)
    logger_provider.add_log_record_processor(
        BatchLogRecordProcessor(
            OTLPLogExporter(
                endpoint=f"{host.rstrip('/')}/i/v1/logs",
                headers={'Authorization': f'Bearer {project_token}'},
            )
        )
    )

    logger = logging.getLogger(LOGGER_NAME)
    logger.setLevel(logging.INFO)
    logger.propagate = False
    logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)
    return logger
