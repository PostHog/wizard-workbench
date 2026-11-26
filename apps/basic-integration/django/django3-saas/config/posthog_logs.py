"""Dedicated OpenTelemetry log export for purpose-written application logs."""

import atexit
import logging


posthog_log = logging.getLogger('posthog.application')


def configure_posthog_log_export(project_token, host):
    """Export only records emitted through ``posthog.application``."""
    if any(
        getattr(handler, '_posthog_log_exporter', False)
        for handler in posthog_log.handlers
    ):
        return

    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    exporter = OTLPLogExporter(
        endpoint=f"{host.rstrip('/')}/i/v1/logs",
        headers={'Authorization': f'Bearer {project_token}'},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    handler = LoggingHandler(logger_provider=logger_provider)
    handler._posthog_log_exporter = True
    posthog_log.addHandler(handler)
    posthog_log.setLevel(logging.INFO)
    posthog_log.propagate = False

    # The batch processor sends in the background; shutdown flushes only on exit.
    atexit.register(logger_provider.shutdown)
