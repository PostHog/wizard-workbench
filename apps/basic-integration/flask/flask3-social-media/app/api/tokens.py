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
    posthog_client = current_app.posthog
    if posthog_client is not None:
        posthog_client.capture('api_token_created')
    return {'token': token}


@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    token_auth.current_user().revoke_token()
    db.session.commit()
    posthog_client = current_app.posthog
    if posthog_client is not None:
        posthog_client.capture('api_token_revoked')
    return '', 204
