import atexit
import logging

from django.apps import AppConfig
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


posthog_client = None
posthog_logs_logger = logging.getLogger('posthog.exporter')


def identify_posthog_user(sender, request, user, **kwargs):
    user_id = str(user.pk)
    posthog_client.identify_context(user_id)
    posthog_client.set(
        distinct_id=user_id,
        properties={
            'email': user.email,
            'username': user.username,
            'name': user.get_full_name(),
            'company_name': user.company_name,
            'is_staff': user.is_staff,
        },
    )


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        global posthog_client

        for variable_name in ('POSTHOG_PROJECT_TOKEN', 'POSTHOG_HOST'):
            if not getattr(settings, variable_name):
                if settings.DEBUG:
                    raise ImproperlyConfigured(
                        f'{variable_name} variable required by PostHog is missing or '
                        f'un-configured, this causes events to be silently missed. This '
                        f'error stops appearing once {variable_name} is configured'
                    )
                return

        from posthog import Posthog

        posthog_client = Posthog(
            project_api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)

        from opentelemetry._logs import set_logger_provider
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

        logger_provider = LoggerProvider()
        set_logger_provider(logger_provider)
        logger_provider.add_log_record_processor(
            BatchLogRecordProcessor(
                OTLPLogExporter(
                    endpoint=f'{settings.POSTHOG_HOST.rstrip("/")}/i/v1/logs',
                    headers={
                        'Authorization': f'Bearer {settings.POSTHOG_PROJECT_TOKEN}',
                    },
                )
            )
        )
        posthog_logs_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
        posthog_logs_logger.setLevel(logging.INFO)
        posthog_logs_logger.propagate = False
        atexit.register(logger_provider.shutdown)

        # Use the shared client for the middleware's request context and
        # exception autocapture, so both inherit the authenticated user.
        settings.POSTHOG_MW_CLIENT = posthog_client

        from django.contrib.auth.signals import user_logged_in

        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid='posthog_identify_authenticated_user',
        )
