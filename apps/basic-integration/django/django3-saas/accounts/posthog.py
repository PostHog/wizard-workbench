from django.conf import settings
from posthog import Posthog


posthog_client = Posthog(
    settings.POSTHOG_PROJECT_TOKEN,
    host=settings.POSTHOG_HOST,
    enable_exception_autocapture=True,
)
