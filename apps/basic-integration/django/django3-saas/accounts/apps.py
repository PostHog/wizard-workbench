import atexit
import os

from django.apps import AppConfig


posthog_client = None


def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the ambient PostHog context after Django authenticates a user."""
    from posthog import identify_context

    identify_context(str(user.pk))
    posthog_client.set(
        distinct_id=str(user.pk),
        properties={
            'email': user.email,
            'name': user.get_full_name() or user.username,
            'company_name': user.company_name,
            'is_staff': user.is_staff,
        },
    )


class AccountsConfig(AppConfig):
    name = 'accounts'

    def ready(self):
        global posthog_client

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

        from posthog import Posthog

        posthog_client = Posthog(
            project_api_key=token,
            host=host,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)

        from django.contrib.auth.signals import user_logged_in

        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid='accounts.identify_posthog_user',
        )
