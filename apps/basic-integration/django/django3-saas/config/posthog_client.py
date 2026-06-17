import os
from posthog import Posthog

posthog = Posthog(
    project_api_key=os.environ.get('POSTHOG_PUBLIC_TOKEN', ''),
    host=os.environ.get('POSTHOG_HOST', ''),
)
