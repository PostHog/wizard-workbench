"""PostHog-only OpenTelemetry log export configuration."""

import logging


posthog_logs_logger = logging.getLogger("posthog.integration.logs")


def configure_posthog_logs(project_token, host):
    """Export only records emitted through ``posthog_logs_logger``."""
    if any(
        getattr(handler, "_posthog_logs_handler", False)
        for handler in posthog_logs_logger.handlers
    ):
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
                headers={"Authorization": f"Bearer {project_token}"},
            )
        )
    )

    handler = LoggingHandler(logger_provider=logger_provider)
    handler._posthog_logs_handler = True
    posthog_logs_logger.addHandler(handler)
    posthog_logs_logger.setLevel(logging.INFO)
    posthog_logs_logger.propagate = False
