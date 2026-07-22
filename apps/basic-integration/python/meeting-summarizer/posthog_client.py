import atexit
import logging
import os

from posthog import Posthog


def initialize_posthog():
    project_token = os.getenv("POSTHOG_PROJECT_TOKEN")
    host = os.getenv("POSTHOG_HOST")
    production = os.getenv("ENVIRONMENT", "development").lower() == "production"

    if not project_token:
        message = (
            "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or "
            "un-configured, this causes events to be silently missed. This error "
            "stops appearing once POSTHOG_PROJECT_TOKEN is configured"
        )
        if production:
            logging.warning(message)
            return None
        raise RuntimeError(message)

    if not host:
        message = (
            "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
            "this causes events to be silently missed. This error stops appearing "
            "once POSTHOG_HOST is configured"
        )
        if production:
            logging.warning(message)
            return None
        raise RuntimeError(message)

    client = Posthog(
        project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(client.shutdown)
    return client


posthog_client = initialize_posthog()
