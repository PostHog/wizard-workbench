from flask import current_app, request
from app import db
from app.api import bp
from app.api.auth import basic_auth, token_auth


@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    user = basic_auth.current_user()
    token = user.get_token()
    db.session.commit()
    posthog_client = current_app.extensions.get('posthog')
    if posthog_client is not None:
        properties = {}
        session_id = request.headers.get('X-POSTHOG-SESSION-ID')
        if session_id:
            properties['$session_id'] = session_id
        posthog_client.capture(
            'api_token_created', distinct_id=str(user.id),
            properties=properties)
    return {'token': token}


@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    user = token_auth.current_user()
    user.revoke_token()
    db.session.commit()
    posthog_client = current_app.extensions.get('posthog')
    if posthog_client is not None:
        properties = {}
        session_id = request.headers.get('X-POSTHOG-SESSION-ID')
        if session_id:
            properties['$session_id'] = session_id
        posthog_client.capture(
            'api_token_revoked', distinct_id=str(user.id),
            properties=properties)
    return '', 204
