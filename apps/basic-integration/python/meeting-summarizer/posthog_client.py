"""PostHog analytics client initialization."""

import atexit
import os

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()

_project_token = os.getenv('POSTHOG_PROJECT_TOKEN')
_host = os.getenv('POSTHOG_HOST')

posthog_client = Posthog(
    _project_token or '',
    host=_host,
    enable_exception_autocapture=True,
    disabled=not bool(_project_token),
)

atexit.register(posthog_client.shutdown)
