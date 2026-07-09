from flask import render_template, request, current_app
from posthog import new_context
from app import db
from app.errors import bp
from app.api.errors import error_response as api_error_response


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
    error_id = None
    client = current_app.posthog_client
    if client:
        with new_context():
            if getattr(request, 'endpoint', None):
                client.capture(
                    distinct_id='anonymous_server_error',
                    event='server_error_handled',
                    properties={
                        '$request_method': request.method,
                        '$request_path': request.path,
                        'endpoint': request.endpoint,
                    },
                )
            error_id = client.capture_exception(error)
    if wants_json_response():
        response, status_code = api_error_response(500)
        response['error_id'] = error_id
        return response, status_code
    return render_template('errors/500.html', error_id=error_id), 500
