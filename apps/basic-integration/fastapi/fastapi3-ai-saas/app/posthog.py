"""PostHog initialization and client setup."""

import os
from posthog import Posthog

# Initialize PostHog client with environment variables
posthog = Posthog(
    project_api_key=os.getenv("POSTHOG_API_KEY", ""),
    host=os.getenv("POSTHOG_HOST", "https://us.i.posthog.com"),
)
