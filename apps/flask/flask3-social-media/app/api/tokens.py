import posthog
from app import db
from app.api import bp
from app.api.auth import basic_auth, token_auth


@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    user = basic_auth.current_user()
    token = user.get_token()
    db.session.commit()
    # PostHog: capture API token obtained
    posthog.capture('api_token_obtained', distinct_id=str(user.id))
    return {'token': token}


@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    user = token_auth.current_user()
    user.revoke_token()
    db.session.commit()
    # PostHog: capture API token revoked
    posthog.capture('api_token_revoked', distinct_id=str(user.id))
    return '', 204
