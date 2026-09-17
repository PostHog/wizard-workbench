"""Accounts application configuration."""

import atexit
import os

from django.apps import AppConfig
from django.conf import settings

posthog_client = None


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        """Initialize the process-wide PostHog client."""
        global posthog_client

        project_token = os.environ.get('POSTHOG_PROJECT_TOKEN')
        host = os.environ.get('POSTHOG_HOST')

        if not project_token:
            if settings.DEBUG:
                raise RuntimeError(
                    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or '
                    'un-configured, this causes events to be silently missed. This error '
                    'stops appearing once POSTHOG_PROJECT_TOKEN is configured'
                )
            return

        if not host:
            if settings.DEBUG:
                raise RuntimeError(
                    'POSTHOG_HOST variable required by PostHog is missing or un-configured, '
                    'this causes events to be silently missed. This error stops appearing '
                    'once POSTHOG_HOST is configured'
                )
            return

        from posthog import Posthog

        posthog_client = Posthog(
            project_token,
            host=host,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)

        # The middleware reads request.user before the view runs. On login and
        # registration requests the user becomes authenticated during the view,
        # so identify the existing request context when Django emits this signal.
        from django.contrib.auth.signals import user_logged_in

        def identify_posthog_user(sender, request, user, **kwargs):
            distinct_id = str(user.pk)
            posthog_client.identify_context(distinct_id)
            posthog_client.set(
                distinct_id=distinct_id,
                properties={
                    'email': user.email,
                    'username': user.username,
                    'name': user.get_full_name() or user.username,
                    'company_name': user.company_name,
                },
            )

        user_logged_in.connect(
            identify_posthog_user,
            dispatch_uid='accounts.posthog.identify_user',
            weak=False,
        )
