import atexit
import os

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        import posthog

        token = os.environ.get('POSTHOG_PROJECT_TOKEN')
        host = os.environ.get('POSTHOG_HOST')
        if not token or not host:
            if self._is_debug():
                missing = 'POSTHOG_PROJECT_TOKEN' if not token else 'POSTHOG_HOST'
                raise RuntimeError(
                    f'{missing} variable required by PostHog is missing or un-configured, '
                    f'this causes events to be silently missed. This error stops appearing '
                    f'once {missing} is configured'
                )
            return

        client = posthog.Posthog(
            project_api_key=token,
            host=host,
            enable_exception_autocapture=True,
        )
        posthog.posthog = client
        atexit.register(client.shutdown)

        from django.contrib.auth.signals import user_logged_in
        from django.dispatch import receiver
        from posthog import identify_context

        @receiver(user_logged_in, weak=False)
        def identify_posthog_user(sender, request, user, **kwargs):
            identify_context(str(user.pk))
            client.set(
                distinct_id=str(user.pk),
                properties={
                    'email': user.email,
                    'username': user.username,
                },
            )

    @staticmethod
    def _is_debug():
        from django.conf import settings
        return settings.DEBUG
