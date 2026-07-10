import atexit

from posthog import Posthog


posthog_client = None


def init_posthog(app):
    global posthog_client

    project_token = app.config.get('POSTHOG_PROJECT_TOKEN')
    host = app.config.get('POSTHOG_HOST')
    if not project_token or not host:
        return None

    posthog_client = Posthog(
        project_api_key=project_token,
        host=host,
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
    return posthog_client


def get_posthog_client():
    return posthog_client


def set_user_properties(user):
    if posthog_client is None or user is None:
        return

    posthog_client.set(str(user.id), {
        'username': user.username,
        'email': user.email,
        'follower_count': user.followers_count(),
        'following_count': user.following_count(),
        'post_count': user.posts_count(),
    })


def capture_event(event, distinct_id=None, properties=None):
    if posthog_client is None or distinct_id is None:
        return

    posthog_client.capture(
        distinct_id=str(distinct_id),
        event=event,
        properties=properties or {},
    )


def capture_exception(exception, distinct_id=None, properties=None):
    if posthog_client is None:
        return None

    return posthog_client.capture_exception(
        exception,
        distinct_id=str(distinct_id) if distinct_id is not None else None,
        properties=properties or {},
    )
