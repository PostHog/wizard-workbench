"""Django application configuration."""

from django.apps import AppConfig
from django.contrib.auth.signals import user_logged_in


def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the login request after Django has authenticated the user."""
    from . import posthog

    if posthog.posthog_client is None:
        return

    distinct_id = str(user.pk)
    posthog.posthog_client.identify_context(distinct_id)
    posthog.posthog_client.set(
        distinct_id=distinct_id,
        properties={
            "email": user.email,
            "name": user.get_full_name(),
            "company_name": user.company_name,
        },
    )


class ConfigConfig(AppConfig):
    name = "config"

    def ready(self):
        from . import posthog

        posthog.initialize_posthog()
        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid="posthog.identify_posthog_user",
        )
