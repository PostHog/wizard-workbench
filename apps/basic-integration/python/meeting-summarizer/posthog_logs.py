"""Isolated OpenTelemetry log export for purpose-written PostHog logs."""

import atexit
import logging
import os


LOGGER_NAME = 'posthog.exported'
_log_provider = None


def get_posthog_log_logger():
    """Return the logger reserved for log records this integration adds."""
    return logging.getLogger(LOGGER_NAME)


def configure_posthog_log_capture():
    """Export only the dedicated PostHog logger when configuration is present."""
    global _log_provider

    logger = get_posthog_log_logger()
    logger.setLevel(logging.INFO)
    logger.propagate = False

    if _log_provider is not None:
        return logger

    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')
    host = os.getenv('POSTHOG_HOST')
    if not project_token or not host:
        return logger

    try:
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    except ImportError:
        logging.warning(
            'PostHog log capture requires OpenTelemetry packages; dedicated logs will not be exported'
        )
        return logger

    try:
        logger_provider = LoggerProvider()
        exporter = OTLPLogExporter(
            endpoint=f'{host.rstrip("/")}/i/v1/logs',
            headers={'Authorization': f'Bearer {project_token}'},
        )
        logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
        logger.addHandler(LoggingHandler(logger_provider=logger_provider))
        _log_provider = logger_provider
        atexit.register(_shutdown_log_provider)
    except Exception:
        logging.exception('Unable to configure PostHog log capture')

    return logger


def _shutdown_log_provider():
    """Flush the background OTLP batch when the server exits."""
    if _log_provider is None:
        return

    try:
        _log_provider.shutdown(timeout_millis=3000)
    except Exception:
        logging.exception('Unable to shut down PostHog log capture')
