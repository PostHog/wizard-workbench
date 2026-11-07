"""PostHog client initialization for the Django application."""

import atexit
import logging
import os


logger = logging.getLogger(__name__)


def create_posthog_client(*, debug: bool):
    """Create the process-wide PostHog client when it is configured."""
    project_api_key = os.environ.get('POSTHOG_PROJECT_API_KEY')
    host = os.environ.get('POSTHOG_HOST')

    if not project_api_key or not host:
        if debug:
            missing_variable = (
                'POSTHOG_PROJECT_API_KEY' if not project_api_key else 'POSTHOG_HOST'
            )
            logger.warning(
                '%s variable required by PostHog is missing or un-configured, '
                'this causes events to be silently missed. This error stops '
                'appearing once %s is configured',
                missing_variable,
                missing_variable,
            )
        return None

    from posthog import Posthog

    client = Posthog(
        project_api_key=project_api_key,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


def create_posthog_log_logger():
    """Configure the isolated logger that exports this app's PostHog logs."""
    project_api_key = os.environ.get('POSTHOG_PROJECT_API_KEY')
    host = os.environ.get('POSTHOG_HOST')

    if not project_api_key or not host:
        return None

    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f'{host.rstrip("/")}/i/v1/logs',
        headers={'Authorization': f'Bearer {project_api_key}'},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    posthog_log_logger = logging.getLogger('app.posthog_logs')
    posthog_log_logger.setLevel(logging.INFO)
    posthog_log_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    posthog_log_logger.propagate = False
    atexit.register(logger_provider.shutdown)
    return posthog_log_logger
