"""PostHog identity handling for authentication events."""

from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from posthog import identify_context

from .posthog import get_posthog_client


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the ambient request context after a user logs in or registers."""
    client = get_posthog_client()
    if client is None:
        return

    distinct_id = str(user.pk)
    identify_context(distinct_id)
    client.set(
        distinct_id=distinct_id,
        properties={
            'email': user.email,
            'username': user.username,
            'name': user.get_full_name() or user.username,
            'company_name': user.company_name,
        },
    )
