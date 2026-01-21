from posthog import capture, identify_context, new_context
from app import db
from app.api import bp
from app.api.auth import basic_auth, token_auth


@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    user = basic_auth.current_user()
    token = user.get_token()
    db.session.commit()

    # PostHog: Capture API token generated event
    with new_context():
        identify_context(str(user.id))
        capture('api_token_generated')

    return {'token': token}


@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    user = token_auth.current_user()

    # PostHog: Capture API token revoked event before revoking
    with new_context():
        identify_context(str(user.id))
        capture('api_token_revoked')

    user.revoke_token()
    db.session.commit()
    return '', 204
