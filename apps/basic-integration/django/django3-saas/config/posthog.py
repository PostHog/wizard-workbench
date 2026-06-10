import os
from posthog import Posthog

posthog = Posthog(
    project_api_key=os.environ.get('POSTHOG_API_KEY'),
    host=os.environ.get('POSTHOG_API_HOST'),
)
