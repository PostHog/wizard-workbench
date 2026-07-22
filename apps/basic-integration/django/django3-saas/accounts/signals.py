"""PostHog identity binding for login requests."""

from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from posthog import identify_context


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Bind the newly authenticated user to the current request context."""
    identify_context(str(user.pk))
