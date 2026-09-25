import atexit
import logging

from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.core.exceptions import ImproperlyConfigured
from posthog import identify_context


class _NoopPosthogClient:
    def capture(self, *args, **kwargs):
        pass


posthog_client = None
posthog_log_provider = None


def identify_posthog_user(sender, request, user, **kwargs):
    """Identify a request after Django authenticates the user within it."""
    distinct_id = str(user.pk)
    identify_context(distinct_id)
    posthog_client.set(
        distinct_id=distinct_id,
        properties={
            'email': user.email,
            'username': user.username,
        },
    )


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        global posthog_client

        if not settings.POSTHOG_PROJECT_TOKEN:
            if settings.DEBUG:
                raise ImproperlyConfigured(
                    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or '
                    'un-configured, this causes events to be silently missed. This error '
                    'stops appearing once POSTHOG_PROJECT_TOKEN is configured'
                )
            posthog_client = _NoopPosthogClient()
            return

        if not settings.POSTHOG_HOST:
            if settings.DEBUG:
                raise ImproperlyConfigured(
                    'POSTHOG_HOST variable required by PostHog is missing or un-configured, '
                    'this causes events to be silently missed. This error stops appearing '
                    'once POSTHOG_HOST is configured'
                )
            posthog_client = _NoopPosthogClient()
            return

        if posthog_client is None:
            from posthog import Posthog

            posthog_client = Posthog(
                project_api_key=settings.POSTHOG_PROJECT_TOKEN,
                host=settings.POSTHOG_HOST,
                enable_exception_autocapture=True,
            )
            atexit.register(posthog_client.shutdown)

        self._configure_posthog_log_export()

        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid='accounts.posthog.identify_posthog_user',
        )

    def _configure_posthog_log_export(self):
        """Export only records created by the dedicated PostHog log logger."""
        global posthog_log_provider

        if posthog_log_provider is not None:
            return

        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

        posthog_log_provider = LoggerProvider()
        log_exporter = OTLPLogExporter(
            endpoint=f'{settings.POSTHOG_HOST.rstrip("/")}/i/v1/logs',
            headers={
                'Authorization': f'Bearer {settings.POSTHOG_PROJECT_TOKEN}',
            },
        )
        posthog_log_provider.add_log_record_processor(
            BatchLogRecordProcessor(log_exporter)
        )

        posthog_log_logger = logging.getLogger('posthog_exporter')
        posthog_log_logger.setLevel(logging.INFO)
        posthog_log_logger.propagate = False
        posthog_log_logger.addHandler(
            LoggingHandler(logger_provider=posthog_log_provider)
        )
        atexit.register(posthog_log_provider.shutdown)

