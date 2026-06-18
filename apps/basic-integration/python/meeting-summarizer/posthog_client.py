"""PostHog analytics client — initialised once at import time."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()

posthog_client = None

_token = os.getenv('POSTHOG_PROJECT_TOKEN')
_host = os.getenv('POSTHOG_HOST')
if _token and _host:
    posthog_client = Posthog(
        _token,
        host=_host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
