import atexit

from django.apps import AppConfig
from django.conf import settings


class _NoopPosthog:
    def capture(self, *args, **kwargs):
        pass


posthog_client = _NoopPosthog()


class MarketingConfig(AppConfig):
    name = 'marketing'

    def ready(self):
        global posthog_client

        api_key = settings.POSTHOG_PROJECT_TOKEN
        host = settings.POSTHOG_HOST
        for variable, value in (
            ('POSTHOG_PROJECT_TOKEN', api_key),
            ('POSTHOG_HOST', host),
        ):
            if not value:
                if settings.DEBUG:
                    raise RuntimeError(
                        f'{variable} variable required by PostHog is missing or '
                        'un-configured, this causes events to be silently missed. '
                        f'This error stops appearing once {variable} is configured'
                    )
                return

        from posthog import Posthog

        posthog_client = Posthog(
            project_api_key=api_key,
            host=host,
            enable_exception_autocapture=True,
        )
        settings.POSTHOG_MW_CLIENT = posthog_client
        atexit.register(posthog_client.shutdown)

        from django.contrib.auth.signals import user_logged_in
        from accounts.models import identify_posthog_user

        user_logged_in.connect(identify_posthog_user, dispatch_uid='posthog_identify_user')
