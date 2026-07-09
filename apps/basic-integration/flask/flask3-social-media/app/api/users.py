import sqlalchemy as sa
from flask import request, url_for, abort, current_app
from posthog import new_context
from app import db
from app.models import User
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import bad_request


def capture_posthog_event(event_name, distinct_id, properties=None,
                          person_properties=None):
    client = current_app.posthog_client
    if not client or not distinct_id:
        return
    with new_context():
        client.set(distinct_id=distinct_id, properties=person_properties or {})
        client.capture(distinct_id=distinct_id, event=event_name,
                       properties=properties or {})


@bp.route('/users/<int:id>', methods=['GET'])
@token_auth.login_required
def get_user(id):
    return db.get_or_404(User, id).to_dict()


@bp.route('/users', methods=['GET'])
@token_auth.login_required
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    return User.to_collection_dict(sa.select(User), page, per_page,
                                   'api.get_users')


@bp.route('/users/<int:id>/followers', methods=['GET'])
@token_auth.login_required
def get_followers(id):
    user = db.get_or_404(User, id)
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    return User.to_collection_dict(user.followers.select(), page, per_page,
                                   'api.get_followers', id=id)


@bp.route('/users/<int:id>/following', methods=['GET'])
@token_auth.login_required
def get_following(id):
    user = db.get_or_404(User, id)
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    return User.to_collection_dict(user.following.select(), page, per_page,
                                   'api.get_following', id=id)


@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if 'username' not in data or 'email' not in data or 'password' not in data:
        return bad_request('must include username, email and password fields')
    if db.session.scalar(sa.select(User).where(
            User.username == data['username'])):
        return bad_request('please use a different username')
    if db.session.scalar(sa.select(User).where(
            User.email == data['email'])):
        return bad_request('please use a different email address')
    user = User()
    user.from_dict(data, new_user=True)
    db.session.add(user)
    db.session.commit()
    capture_posthog_event(
        'api_user_created',
        distinct_id=str(user.id),
        properties={
            '$request_method': request.method,
            '$request_path': request.path,
            'has_about_me': bool(user.about_me),
        },
        person_properties={
            'username': user.username,
            'email': user.email,
        },
    )
    return user.to_dict(), 201, {'Location': url_for('api.get_user',
                                                     id=user.id)}


@bp.route('/users/<int:id>', methods=['PUT'])
@token_auth.login_required
def update_user(id):
    if token_auth.current_user().id != id:
        abort(403)
    user = db.get_or_404(User, id)
    data = request.get_json()
    if 'username' in data and data['username'] != user.username and \
        db.session.scalar(sa.select(User).where(
            User.username == data['username'])):
        return bad_request('please use a different username')
    if 'email' in data and data['email'] != user.email and \
        db.session.scalar(sa.select(User).where(
            User.email == data['email'])):
        return bad_request('please use a different email address')
    user.from_dict(data, new_user=False)
    db.session.commit()
    capture_posthog_event(
        'api_user_updated',
        distinct_id=str(user.id),
        properties={
            '$request_method': request.method,
            '$request_path': request.path,
            'updated_username': 'username' in data,
            'updated_email': 'email' in data,
            'updated_about_me': 'about_me' in data,
        },
        person_properties={
            'username': user.username,
            'email': user.email,
        },
    )
    return user.to_dict()
