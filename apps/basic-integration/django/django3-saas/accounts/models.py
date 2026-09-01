from hashlib import md5
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    company_name = models.CharField(max_length=200, blank=True)
    email_verified_at = models.DateTimeField(null=True, blank=True)

    # Stripe customer ID for billing
    stripe_customer_id = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.username

    def avatar_url(self, size=128):
        digest = md5(self.email.lower().encode('utf-8')).hexdigest()
        return f'https://www.gravatar.com/avatar/{digest}?d=identicon&s={size}'

    def get_active_subscription(self):
        return self.subscriptions.filter(status='active').first()

    def is_subscribed(self):
        return self.subscriptions.filter(status='active').exists()

    def get_plan(self):
        sub = self.get_active_subscription()
        return sub.plan if sub else None

    def is_email_verified(self):
        return self.email_verified_at is not None


def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the ambient PostHog context after login or registration."""
    from marketing.apps import posthog_client

    user_id = str(user.pk)
    posthog_client.identify_context(user_id)
    posthog_client.set(
        distinct_id=user_id,
        properties={
            'email': user.email,
            'name': user.get_full_name() or user.username,
            'company_name': user.company_name,
        },
    )
