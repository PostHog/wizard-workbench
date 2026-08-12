"""Django application configuration and PostHog initialization."""

import atexit

from django.apps import AppConfig
from django.conf import settings


class _DisabledPostHog:
    def capture(self, *args, **kwargs):
        pass


posthog_client = _DisabledPostHog()


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        """Create the process-wide PostHog client when it is configured."""
        global posthog_client

        if not settings.POSTHOG_PROJECT_TOKEN:
            if settings.DEBUG:
                raise RuntimeError(
                    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or '
                    'un-configured, this causes events to be silently missed. This error '
                    'stops appearing once POSTHOG_PROJECT_TOKEN is configured'
                )
            return

        if not settings.POSTHOG_HOST:
            if settings.DEBUG:
                raise RuntimeError(
                    'POSTHOG_HOST variable required by PostHog is missing or un-configured, '
                    'this causes events to be silently missed. This error stops appearing '
                    'once POSTHOG_HOST is configured'
                )
            return

        import posthog
        from posthog import Posthog

        posthog_client = Posthog(
            settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        posthog.default_client = posthog_client
        atexit.register(posthog_client.shutdown)

        from django.contrib.auth.signals import user_logged_in

        def identify_login_request(sender, request, user, **kwargs):
            """Identify the context created before Django authenticates a login."""
            distinct_id = str(user.pk)
            posthog_client.identify_context(distinct_id)
            posthog_client.set(
                distinct_id=distinct_id,
                properties={
                    'email': user.email,
                    'name': user.get_full_name() or user.username,
                    'company_name': user.company_name,
                },
            )

        user_logged_in.connect(
            identify_login_request,
            dispatch_uid='posthog_identify_login_request',
        )
