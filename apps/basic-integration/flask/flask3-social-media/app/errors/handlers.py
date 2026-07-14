from flask import render_template, request
from flask_login import current_user
from app import db
from app.errors import bp
from app.api.errors import error_response as api_error_response
from app.posthog import get_distinct_id, get_posthog_client


def wants_json_response():
    return request.accept_mimetypes['application/json'] >= \
        request.accept_mimetypes['text/html']


@bp.app_errorhandler(404)
def not_found_error(error):
    if wants_json_response():
        return api_error_response(404)
    return render_template('errors/404.html'), 404


@bp.app_errorhandler(500)
def internal_error(error):
    db.session.rollback()
    posthog_client = get_posthog_client()
    if posthog_client is not None:
        event_id = posthog_client.capture_exception(
            error,
            distinct_id=get_distinct_id(current_user)
            if current_user.is_authenticated else None,
            properties={
                'path': request.path,
                'method': request.method,
                'response_format': 'json' if wants_json_response() else 'html',
            },
        )
    else:
        event_id = None
    if wants_json_response():
        return api_error_response(500)
    return render_template('errors/500.html', error_id=event_id), 500
