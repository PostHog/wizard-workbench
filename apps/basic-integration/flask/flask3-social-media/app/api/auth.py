import sqlalchemy as sa
from flask import current_app
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app import db
from app.models import User
from app.api.errors import error_response

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


def identify_posthog_api_user(user):
    """Bind API authentication to the request-scoped PostHog context."""
    posthog_client = current_app.posthog_client
    if posthog_client is not None and user is not None:
        posthog_client.identify_context(str(user.id))


@basic_auth.verify_password
def verify_password(username, password):
    user = db.session.scalar(sa.select(User).where(User.username == username))
    if user and user.check_password(password):
        identify_posthog_api_user(user)
        return user


@basic_auth.error_handler
def basic_auth_error(status):
    return error_response(status)


@token_auth.verify_token
def verify_token(token):
    user = User.check_token(token) if token else None
    identify_posthog_api_user(user)
    return user


@token_auth.error_handler
def token_auth_error(status):
    return error_response(status)
