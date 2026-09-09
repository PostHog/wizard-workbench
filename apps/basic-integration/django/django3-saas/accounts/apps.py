import atexit

from django.apps import AppConfig
from django.conf import settings


posthog_client = None


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        global posthog_client

        missing_variables = [
            variable
            for variable in ('POSTHOG_PROJECT_TOKEN', 'POSTHOG_HOST')
            if not getattr(settings, variable)
        ]
        if missing_variables:
            if settings.DEBUG:
                variable = missing_variables[0]
                raise RuntimeError(
                    f'{variable} variable required by PostHog is missing or un-configured, '
                    f'this causes events to be silently missed. This error stops appearing '
                    f'once {variable} is configured'
                )
            return

        from posthog import Posthog

        posthog_client = Posthog(
            project_api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)

        from django.contrib.auth.signals import user_logged_in
        from posthog import identify_context

        def identify_posthog_user(sender, request, user, **kwargs):
            distinct_id = str(user.pk)
            identify_context(distinct_id)
            posthog_client.set(
                distinct_id=distinct_id,
                properties={
                    'email': user.email,
                    'username': user.username,
                    'name': user.get_full_name(),
                },
            )

        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid='accounts.identify_posthog_user',
            weak=False,
        )
