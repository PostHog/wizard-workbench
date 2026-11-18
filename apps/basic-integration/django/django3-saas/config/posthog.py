"""Process-wide PostHog client configuration for Django."""

import atexit
import logging
import os

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from posthog import Posthog

logger = logging.getLogger(__name__)
posthog_logs_logger = logging.getLogger('posthog.logs')
posthog_logs_logger.propagate = False

posthog_api_key = os.environ.get('POSTHOG_API_KEY')
posthog_host = os.environ.get('POSTHOG_HOST')
debug = os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes')

posthog_client = None

for variable_name, value in (
    ('POSTHOG_API_KEY', posthog_api_key),
    ('POSTHOG_HOST', posthog_host),
):
    if not value and debug:
        logger.warning(
            '%s variable required by PostHog is missing or un-configured, this '
            'causes events to be silently missed. This error stops appearing '
            'once %s is configured',
            variable_name,
            variable_name,
        )

if posthog_api_key and posthog_host:
    posthog_client = Posthog(
        project_api_key=posthog_api_key,
        host=posthog_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)

    posthog_log_provider = LoggerProvider()
    posthog_log_exporter = OTLPLogExporter(
        endpoint=f'{posthog_host.rstrip("/")}/i/v1/logs',
        headers={'Authorization': f'Bearer {posthog_api_key}'},
    )
    posthog_log_provider.add_log_record_processor(
        BatchLogRecordProcessor(posthog_log_exporter)
    )
    posthog_logs_logger.addHandler(
        LoggingHandler(logger_provider=posthog_log_provider)
    )
    posthog_logs_logger.setLevel(logging.INFO)
    atexit.register(posthog_log_provider.shutdown)
