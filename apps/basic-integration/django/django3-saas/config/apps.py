"""Django application configuration for PostHog."""

from django.apps import AppConfig
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from posthog import identify_context


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the ambient request context after Django completes login."""
    identify_context(str(user.pk))

    from .posthog import posthog_client

    if posthog_client:
        posthog_client.set(
            distinct_id=str(user.pk),
            properties={
                'email': user.email,
                'username': user.username,
                'name': user.get_full_name() or user.username,
            },
        )


class PostHogConfig(AppConfig):
    name = 'config'

    def ready(self):
        """Initialize the shared PostHog client once at Django startup."""
        from .posthog import initialize_posthog

        initialize_posthog()
