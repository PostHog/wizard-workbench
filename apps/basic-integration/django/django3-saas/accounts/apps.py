import atexit

from django.apps import AppConfig
from django.conf import settings


class NoOpPosthog:
    def capture(self, *args, **kwargs):
        pass

    def set(self, *args, **kwargs):
        pass


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        import posthog

        token = settings.POSTHOG_PROJECT_TOKEN
        host = settings.POSTHOG_HOST
        if not token or not host:
            if settings.DEBUG:
                missing = 'POSTHOG_PROJECT_TOKEN' if not token else 'POSTHOG_HOST'
                raise RuntimeError(
                    f'{missing} variable required by PostHog is missing or '
                    f'un-configured, this causes events to be silently missed. '
                    f'This error stops appearing once {missing} is configured'
                )
            self.posthog_client = NoOpPosthog()
            return

        self.posthog_client = posthog.Posthog(
            project_api_key=token,
            host=host,
            enable_exception_autocapture=True,
        )
        atexit.register(self.posthog_client.shutdown)

        from django.contrib.auth.signals import user_logged_in

        user_logged_in.connect(
            self.identify_posthog_user,
            dispatch_uid='accounts.posthog.identify_posthog_user',
        )

    def identify_posthog_user(self, sender, request, user, **kwargs):
        """Identify the ambient context after Django authenticates a user."""
        from posthog import identify_context

        distinct_id = str(user.pk)
        identify_context(distinct_id)
        self.posthog_client.set(
            distinct_id=distinct_id,
            properties={
                'email': user.email,
                'name': user.get_full_name() or user.username,
                'username': user.username,
                'company_name': user.company_name,
                'is_staff': user.is_staff,
            },
        )
