from flask import render_template, request
import posthog
from flask_login import current_user
from posthog import identify_context, new_context
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

    # PostHog: Capture exception for error tracking
    with new_context():
        if current_user.is_authenticated:
            identify_context(current_user.email)
        posthog.capture_exception(error)

    if wants_json_response():
        return api_error_response(500)
    return render_template('errors/500.html'), 500
