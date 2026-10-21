import atexit

from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from posthog import Posthog


posthog_client = None
posthog_log_logger = None


def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the context after Django has authenticated a user."""
    distinct_id = str(user.pk)
    posthog_client.identify_context(distinct_id)
    posthog_client.set(
        distinct_id=distinct_id,
        properties={
            'email': user.email,
            'username': user.username,
            'name': user.get_full_name(),
            'company_name': user.company_name,
            'is_staff': user.is_staff,
        },
    )


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        global posthog_client, posthog_log_logger

        if not settings.POSTHOG_API_KEY:
            if settings.DEBUG:
                raise RuntimeError(
                    'POSTHOG_API_KEY variable required by PostHog is missing or '
                    'un-configured, this causes events to be silently missed. This '
                    'error stops appearing once POSTHOG_API_KEY is configured'
                )
            return

        if not settings.POSTHOG_HOST:
            if settings.DEBUG:
                raise RuntimeError(
                    'POSTHOG_HOST variable required by PostHog is missing or '
                    'un-configured, this causes events to be silently missed. This '
                    'error stops appearing once POSTHOG_HOST is configured'
                )
            return

        posthog_client = Posthog(
            settings.POSTHOG_API_KEY,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        settings.POSTHOG_MW_CLIENT = posthog_client

        import logging
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

        logger_provider = LoggerProvider()
        logger_provider.add_log_record_processor(
            BatchLogRecordProcessor(
                OTLPLogExporter(
                    endpoint=f"{settings.POSTHOG_HOST.rstrip('/')}/i/v1/logs",
                    headers={'Authorization': f'Bearer {settings.POSTHOG_API_KEY}'},
                )
            )
        )
        posthog_log_logger = logging.getLogger('posthog.export')
        posthog_log_logger.setLevel(logging.INFO)
        posthog_log_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
        posthog_log_logger.propagate = False

        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid='accounts.posthog.identify_posthog_user',
        )
        atexit.register(posthog_client.shutdown)
        atexit.register(logger_provider.shutdown)
