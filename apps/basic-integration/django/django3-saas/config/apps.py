from django.apps import AppConfig
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from posthog import identify_context


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the login request after Django authenticates the user."""
    identify_context(str(user.pk))

    from .posthog import posthog_client

    if posthog_client is not None:
        posthog_client.set(
            distinct_id=str(user.pk),
            properties={
                'email': user.email,
                'username': user.username,
            },
        )


class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        from .posthog import initialize_posthog

        initialize_posthog()
