import sqlalchemy as sa
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app import db, posthog_client
from posthog import identify_context
from app.models import User
from app.api.errors import error_response

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


def bind_posthog_user(user):
    """Bind the API request to its authenticated user."""
    if posthog_client:
        identify_context(str(user.id))
        posthog_client.set(
            distinct_id=str(user.id),
            properties={
                'email': user.email,
                'username': user.username,
            },
        )


@basic_auth.verify_password
def verify_password(username, password):
    user = db.session.scalar(sa.select(User).where(User.username == username))
    if user and user.check_password(password):
        bind_posthog_user(user)
        return user


@basic_auth.error_handler
def basic_auth_error(status):
    return error_response(status)


@token_auth.verify_token
def verify_token(token):
    user = User.check_token(token) if token else None
    if user:
        bind_posthog_user(user)
    return user


@token_auth.error_handler
def token_auth_error(status):
    return error_response(status)
