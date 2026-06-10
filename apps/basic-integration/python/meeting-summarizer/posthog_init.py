"""PostHog initialization and configuration"""

import os
from posthog import Posthog

def init_posthog():
    """Initialize PostHog SDK with environment variables"""
    api_key = os.getenv('POSTHOG_API_KEY')
    api_host = os.getenv('POSTHOG_API_HOST')

    if not api_key or not api_host:
        raise ValueError(
            "PostHog initialization failed: "
            "POSTHOG_API_KEY and POSTHOG_API_HOST environment variables are required"
        )

    posthog = Posthog(
        project_api_key=api_key,
        host=api_host,
        debug=os.getenv('POSTHOG_DEBUG', 'false').lower() == 'true'
    )

    return posthog


# Initialize on import
posthog = init_posthog()
