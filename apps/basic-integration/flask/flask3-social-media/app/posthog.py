"""Shared PostHog client for the Flask application."""

import atexit

from flask import current_app, g
from posthog import Posthog


def init_posthog(app):
    """Create one PostHog client for the process and attach it to the app."""
    token = app.config.get("POSTHOG_PROJECT_TOKEN")
    host = app.config.get("POSTHOG_HOST")

    if not token or not host:
        if app.debug:
            missing = "POSTHOG_PROJECT_TOKEN" if not token else "POSTHOG_HOST"
            raise RuntimeError(
                f"{missing} variable required by PostHog is missing or un-configured, "
                f"this causes events to be silently missed. This error stops appearing "
                f"once {missing} is configured"
            )
        app.posthog_client = None
        return None

    client = Posthog(
        project_api_key=token,
        host=host,
        enable_exception_autocapture=True,
    )
    app.posthog_client = client
    atexit.register(client.shutdown)
    return client


def start_request_context():
    """Open a fresh PostHog context for the current Flask request."""
    client = current_app.posthog_client
    if client is None:
        return

    context = client.new_context(fresh=True)
    context.__enter__()
    g.posthog_context = context


def bind_request_context(user=None, distinct_id=None, session_id=None):
    """Open and identify the request context from auth or tracing headers."""
    start_request_context()
    if user is not None and user.is_authenticated:
        identify_request_user(user)
    else:
        identify_request_distinct_id(distinct_id, session_id)


def identify_request_distinct_id(distinct_id, session_id=None):
    """Bind trusted or inherited analytics identity to the current request."""
    client = current_app.posthog_client
    if client is None or not distinct_id:
        return

    client.identify_context(str(distinct_id))
    if session_id:
        client.set_context_session(session_id)


def identify_request_user(user):
    """Identify a user within the request context using the stable database id."""
    identify_request_distinct_id(str(user.id))


def set_user_person_properties(user):
    """Store user profile details as person properties, never event properties."""
    client = current_app.posthog_client
    if client is None:
        return

    client.set(
        distinct_id=str(user.id),
        properties={
            "username": user.username,
            "email": user.email,
        },
    )


def end_request_context(error=None):
    """Close the PostHog context created for this request."""
    context = g.pop("posthog_context", None)
    if context is not None:
        context.__exit__(type(error), error, error.__traceback__ if error else None)
