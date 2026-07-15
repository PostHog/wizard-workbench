import atexit

from django.conf import settings
from posthog import Posthog

posthog_client = None


def initialize_posthog():
    global posthog_client

    if posthog_client is None:
        posthog_client = Posthog(
            api_key=settings.POSTHOG_PROJECT_TOKEN,
            host=settings.POSTHOG_HOST,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)


def set_person_properties(user):
    posthog_client.set(
        distinct_id=str(user.pk),
        properties={
            'email': user.email,
            'username': user.username,
            'company_name': user.company_name,
        },
    )


def capture_for_user(user, event, properties=None):
    posthog_client.capture(
        distinct_id=str(user.pk),
        event=event,
        properties=properties or {},
    )
