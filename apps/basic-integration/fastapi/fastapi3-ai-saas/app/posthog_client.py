"""PostHog client — initialized at module load time from settings."""

import atexit
from typing import Optional

from posthog import Posthog

from app.config import get_settings

_settings = get_settings()

posthog_client: Optional[Posthog] = None

if not _settings.posthog_disabled and _settings.posthog_project_token:
    posthog_client = Posthog(
        _settings.posthog_project_token,
        host=_settings.posthog_host,
        debug=_settings.debug,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
