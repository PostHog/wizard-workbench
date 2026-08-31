import atexit

from django.apps import AppConfig
from django.conf import settings


class ConfigConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'config'

    def ready(self):
        if not settings.POSTHOG_PROJECT_TOKEN or not settings.POSTHOG_HOST:
            return

        from django.contrib.auth.signals import user_logged_in
        from posthog import Posthog, identify_context
        import posthog

        posthog_client = Posthog(
            settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        posthog.default_client = posthog_client
        atexit.register(posthog_client.shutdown)

        def identify_posthog_user(sender, request, user, **kwargs):
            distinct_id = str(user.pk)
            identify_context(distinct_id)
            posthog.set(
                distinct_id=distinct_id,
                properties={
                    'email': user.email,
                    'name': user.get_full_name() or user.username,
                    'company_name': user.company_name,
                    'is_staff': user.is_staff,
                },
            )

        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid='posthog_identify_authenticated_user',
            weak=False,
        )
