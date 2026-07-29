import sqlalchemy as sa
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app import db
from app.models import User
from app.api.errors import error_response
from posthog import identify_context

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(username, password):
    user = db.session.scalar(sa.select(User).where(User.username == username))
    if user and user.check_password(password):
        identify_context(str(user.id))
        return user


@basic_auth.error_handler
def basic_auth_error(status):
    return error_response(status)


@token_auth.verify_token
def verify_token(token):
    user = User.check_token(token) if token else None
    if user:
        identify_context(str(user.id))
    return user


@token_auth.error_handler
def token_auth_error(status):
    return error_response(status)
