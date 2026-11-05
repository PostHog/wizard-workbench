"""Process-wide PostHog client for the MCP server."""

import atexit
import os
import sys

from dotenv import load_dotenv
from posthog import Posthog

load_dotenv()


def _initialize_posthog() -> Posthog | None:
    api_key = os.getenv("POSTHOG_API_KEY")
    host = os.getenv("POSTHOG_HOST")
    if not api_key:
        print(
            "POSTHOG_API_KEY variable required by PostHog is missing or "
            "un-configured, this causes events to be silently missed. This error "
            "stops appearing once POSTHOG_API_KEY is configured",
            file=sys.stderr,
        )
        return None
    if not host:
        print(
            "POSTHOG_HOST variable required by PostHog is missing or un-configured, "
            "this causes events to be silently missed. This error stops appearing "
            "once POSTHOG_HOST is configured",
            file=sys.stderr,
        )
        return None

    return Posthog(
        api_key,
        host=host,
        enable_exception_autocapture=True,
    )


posthog_client = _initialize_posthog()

if posthog_client:
    atexit.register(posthog_client.shutdown)
