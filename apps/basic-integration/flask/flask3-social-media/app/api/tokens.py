from flask import current_app
from app import db
from app.api import bp
from app.api.auth import basic_auth, token_auth


@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    user = basic_auth.current_user()
    token = user.get_token()
    db.session.commit()
    current_app.extensions['posthog'].capture(
        str(user.id), 'api_token_issued', {
            'authentication_method': 'basic_auth'
        })
    return {'token': token}


@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    user = token_auth.current_user()
    user.revoke_token()
    db.session.commit()
    current_app.extensions['posthog'].capture(
        str(user.id), 'api_token_revoked', {
            'authentication_method': 'token'
        })
    return '', 204
