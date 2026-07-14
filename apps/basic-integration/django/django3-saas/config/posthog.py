import atexit

from django.conf import settings
from posthog import Posthog


posthog_client = Posthog(
    project_api_key=settings.POSTHOG_PROJECT_TOKEN,
    host=settings.POSTHOG_HOST,
    enable_exception_autocapture=True,
)

atexit.register(posthog_client.shutdown)
