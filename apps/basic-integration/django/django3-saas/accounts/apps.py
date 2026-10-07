"""Application configuration for the accounts app."""

import atexit
import logging

from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.core.exceptions import ImproperlyConfigured
from django.dispatch import receiver


posthog_client = None
posthog_logs_configured = False
posthog_logs_logger = logging.getLogger("posthog.exporter")


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the active request after Django authenticates a user."""
    if posthog_client is None:
        return

    distinct_id = str(user.pk)
    posthog_client.identify_context(distinct_id)
    posthog_client.set(
        distinct_id=distinct_id,
        properties={
            "email": user.email,
            "username": user.username,
            "name": user.get_full_name() or user.username,
            "company_name": user.company_name,
        },
    )


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        """Initialize the process-wide PostHog client when configured."""
        global posthog_client, posthog_logs_configured

        for variable_name in ("POSTHOG_PROJECT_TOKEN", "POSTHOG_HOST"):
            if not getattr(settings, variable_name):
                if settings.DEBUG:
                    raise ImproperlyConfigured(
                        f"{variable_name} variable required by PostHog is missing or "
                        f"un-configured, this causes events to be silently missed. "
                        f"This error stops appearing once {variable_name} is configured"
                    )
                return

        from posthog import Posthog

        posthog_client = Posthog(
            project_api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        settings.POSTHOG_MW_CLIENT = posthog_client
        atexit.register(posthog_client.shutdown)

        if posthog_logs_configured:
            return

        from opentelemetry._logs import set_logger_provider
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
        from opentelemetry.sdk.resources import Resource

        logger_provider = LoggerProvider(
            resource=Resource.create({"service.name": "django3-saas"})
        )
        set_logger_provider(logger_provider)
        otlp_exporter = OTLPLogExporter(
            endpoint=f"{settings.POSTHOG_HOST.rstrip('/')}/i/v1/logs",
            headers={"Authorization": f"Bearer {settings.POSTHOG_PROJECT_TOKEN}"},
        )
        logger_provider.add_log_record_processor(
            BatchLogRecordProcessor(otlp_exporter)
        )

        posthog_logs_logger.setLevel(logging.INFO)
        posthog_logs_logger.addHandler(
            LoggingHandler(logger_provider=logger_provider)
        )
        posthog_logs_logger.propagate = False
        posthog_logs_configured = True
        atexit.register(logger_provider.shutdown)
