import os
from posthog import Posthog

posthog = Posthog(
    project_api_key=os.getenv('POSTHOG_API_KEY'),
    host=os.getenv('POSTHOG_HOST'),
)
