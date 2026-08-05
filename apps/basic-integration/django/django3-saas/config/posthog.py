"""Shared PostHog client for Django request handling and application events."""

import atexit

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from posthog import Posthog

posthog_client = None


def initialize_posthog():
    """Create the process-wide PostHog client when analytics is configured."""
    global posthog_client

    missing_variable = next(
        (
            variable
            for variable, value in (
                ('POSTHOG_PROJECT_TOKEN', settings.POSTHOG_PROJECT_TOKEN),
                ('POSTHOG_HOST', settings.POSTHOG_HOST),
            )
            if not value
        ),
        None,
    )

    if missing_variable:
        if settings.DEBUG:
            raise ImproperlyConfigured(
                f'{missing_variable} variable required by PostHog is missing or '
                f'un-configured, this causes events to be silently missed. This '
                f'error stops appearing once {missing_variable} is configured'
            )
        return None

    posthog_client = Posthog(
        project_api_key=settings.POSTHOG_PROJECT_TOKEN,
        host=settings.POSTHOG_HOST,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)

    # Django's context middleware uses this instance to capture view exceptions.
    settings.POSTHOG_MW_CLIENT = posthog_client
    return posthog_client
