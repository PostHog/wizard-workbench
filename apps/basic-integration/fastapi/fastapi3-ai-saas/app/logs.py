"""Dedicated PostHog log export configuration."""

import logging

posthog_log_logger = logging.getLogger("acme_ai.posthog")


def configure_posthog_logs(project_token: str, host: str):
    """Configure an isolated OTLP logger for purpose-written application logs."""
    from opentelemetry._logs import set_logger_provider
    from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    logger_provider = LoggerProvider()
    logger_provider.add_log_record_processor(
        BatchLogRecordProcessor(
            OTLPLogExporter(
                endpoint=f"{host.rstrip('/')}/i/v1/logs",
                headers={"Authorization": f"Bearer {project_token}"},
                timeout=3,
            ),
            export_timeout_millis=3000,
        )
    )
    set_logger_provider(logger_provider)

    posthog_log_logger.setLevel(logging.INFO)
    posthog_log_logger.propagate = False
    posthog_log_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    return logger_provider
