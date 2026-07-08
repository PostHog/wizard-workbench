from flask import current_app
from posthog import identify_context
from app import db
from app.api import bp
from app.api.auth import basic_auth, token_auth


@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    token = basic_auth.current_user().get_token()
    db.session.commit()
    return {'token': token}


@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    user = token_auth.current_user()
    with current_app.posthog_client.new_context(fresh=True):
        identify_context(str(user.id))
        current_app.posthog_client.capture('api_token_revoked')
    user.revoke_token()
    db.session.commit()
    return '', 204
