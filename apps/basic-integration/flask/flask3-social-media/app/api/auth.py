import sqlalchemy as sa
from flask import current_app
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app import db
from app.models import User
from app.api.errors import error_response
from posthog import identify_context

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


def identify_posthog_user(user):
    """Associate token-authenticated API requests with their stable user ID."""
    if current_app.posthog is None:
        return

    distinct_id = str(user.id)
    identify_context(distinct_id)
    current_app.posthog.set(
        distinct_id=distinct_id,
        properties={
            'email': user.email,
            'username': user.username,
        },
    )


@basic_auth.verify_password
def verify_password(username, password):
    user = db.session.scalar(sa.select(User).where(User.username == username))
    if user and user.check_password(password):
        identify_posthog_user(user)
        return user


@basic_auth.error_handler
def basic_auth_error(status):
    return error_response(status)


@token_auth.verify_token
def verify_token(token):
    user = User.check_token(token) if token else None
    if user:
        identify_posthog_user(user)
    return user


@token_auth.error_handler
def token_auth_error(status):
    return error_response(status)
