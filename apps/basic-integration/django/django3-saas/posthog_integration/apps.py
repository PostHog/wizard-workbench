import atexit

from django.apps import AppConfig
from django.conf import settings


class PostHogIntegrationConfig(AppConfig):
    name = 'posthog_integration'

    def ready(self):
        import posthog

        self.posthog_client = None
        token = settings.POSTHOG_PROJECT_TOKEN
        host = settings.POSTHOG_HOST
        if not token or not host:
            if settings.DEBUG:
                missing = 'POSTHOG_PROJECT_TOKEN' if not token else 'POSTHOG_HOST'
                raise RuntimeError(
                    f'{missing} variable required by PostHog is missing or un-configured, '
                    f'this causes events to be silently missed. This error stops appearing '
                    f'once {missing} is configured'
                )
            return

        self.posthog_client = posthog.Posthog(
            project_api_key=token,
            host=host,
            enable_exception_autocapture=True,
        )
        atexit.register(self.posthog_client.shutdown)

        from django.contrib.auth.signals import user_logged_in
        from posthog import identify_context

        def identify_logged_in_user(sender, request, user, **kwargs):
            distinct_id = str(user.pk)
            identify_context(distinct_id)
            self.posthog_client.set(
                distinct_id=distinct_id,
                properties={
                    'email': user.email,
                    'username': user.username,
                    'name': user.get_full_name() or user.username,
                    'is_staff': user.is_staff,
                },
            )

        user_logged_in.connect(
            identify_logged_in_user,
            dispatch_uid='posthog_integration.identify_logged_in_user',
        )
