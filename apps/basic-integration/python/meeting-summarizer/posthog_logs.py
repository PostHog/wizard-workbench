"""Dedicated OpenTelemetry log export for purpose-built PostHog records."""

import atexit
import logging
import os

from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource

from posthog_client import posthog_client


posthog_logs = logging.getLogger("posthog.meeting_summarizer")
posthog_logs.setLevel(logging.INFO)
posthog_logs.propagate = False

if posthog_client:
    project_token = os.environ["POSTHOG_PROJECT_TOKEN"]
    posthog_host = os.environ["POSTHOG_HOST"]
    logger_provider = LoggerProvider(
        resource=Resource.create({
            "service.name": "meeting-summarizer",
            "deployment.environment": os.getenv("ENVIRONMENT", "development"),
        })
    )
    set_logger_provider(logger_provider)
    otlp_exporter = OTLPLogExporter(
        endpoint=f"{posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {project_token}"},
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(otlp_exporter))
    posthog_logs.addHandler(LoggingHandler(logger_provider=logger_provider))
    atexit.register(logger_provider.shutdown)
else:
    posthog_logs.addHandler(logging.NullHandler())
