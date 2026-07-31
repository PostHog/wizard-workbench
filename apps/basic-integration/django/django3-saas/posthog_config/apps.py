import atexit
import os

from django.apps import AppConfig


class PostHogConfig(AppConfig):
    name = 'posthog_config'

    def ready(self):
        import posthog

        token = os.environ.get('POSTHOG_PROJECT_TOKEN')
        host = os.environ.get('POSTHOG_HOST')

        if not token or not host:
            if os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes'):
                missing = 'POSTHOG_PROJECT_TOKEN' if not token else 'POSTHOG_HOST'
                raise RuntimeError(
                    f'{missing} variable required by PostHog is missing or un-configured, '
                    f'this causes events to be silently missed. This error stops appearing '
                    f'once {missing} is configured'
                )
            return

        posthog_client = posthog.Posthog(
            project_api_key=token,
            host=host,
            enable_exception_autocapture=True,
        )
        posthog.client = posthog_client
        atexit.register(posthog_client.shutdown)

        from django.contrib.auth.signals import user_logged_in
        from posthog import identify_context

        def identify_logged_in_user(sender, request, user, **kwargs):
            distinct_id = str(user.pk)
            identify_context(distinct_id)
            posthog_client.set(
                distinct_id=distinct_id,
                properties={
                    'email': user.email,
                    'username': user.username,
                    'company_name': user.company_name,
                },
            )

        user_logged_in.connect(
            identify_logged_in_user,
            dispatch_uid='posthog_config.identify_logged_in_user',
        )
