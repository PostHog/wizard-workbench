from app import db
from app.api import bp
from app.api.auth import basic_auth, token_auth
from app.posthog import capture_for_user, get_posthog_client


@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    user = basic_auth.current_user()
    token = user.get_token()
    db.session.commit()
    capture_for_user(get_posthog_client(), user, 'api_token_issued', {
        'token_scope': 'api',
    })
    return {'token': token}


@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    user = token_auth.current_user()
    user.revoke_token()
    db.session.commit()
    capture_for_user(get_posthog_client(), user, 'api_token_revoked', {
        'token_scope': 'api',
    })
    return '', 204
