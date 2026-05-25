from app import db
from app import posthog_client
from app.api import bp
from app.api.auth import basic_auth, token_auth
from posthog import identify_context


@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    user = basic_auth.current_user()
    token = user.get_token()
    db.session.commit()
    with posthog_client.new_context():
        identify_context(user.username)
        posthog_client.capture('api_token_generated')
    return {'token': token}


@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    user = token_auth.current_user()
    user.revoke_token()
    db.session.commit()
    with posthog_client.new_context():
        identify_context(user.username)
        posthog_client.capture('api_token_revoked')
    return '', 204
