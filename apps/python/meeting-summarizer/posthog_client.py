"""PostHog analytics client initialization."""

import os
from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def initialize_posthog():
    """Initialize and return a PostHog client instance."""
    project_token = os.getenv('POSTHOG_PROJECT_TOKEN')

    if not project_token:
        return None

    return Posthog(
        project_token,
        host=os.getenv('POSTHOG_HOST'),
        enable_exception_autocapture=True
    )


posthog_client = initialize_posthog()
