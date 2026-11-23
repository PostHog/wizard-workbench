from flask import current_app
from app import db
from app.api import bp
from app.api.auth import basic_auth, token_auth


def _capture_event(event):
    """Capture an event without allowing analytics failures to affect requests."""
    posthog_client = current_app.extensions.get('posthog')
    if posthog_client:
        try:
            posthog_client.capture(event)
        except Exception:
            current_app.logger.warning(
                'PostHog event capture failed', exc_info=True)


@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    token = basic_auth.current_user().get_token()
    db.session.commit()
    _capture_event('api_token_created')
    return {'token': token}


@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    token_auth.current_user().revoke_token()
    db.session.commit()
    _capture_event('api_token_revoked')
    return '', 204
