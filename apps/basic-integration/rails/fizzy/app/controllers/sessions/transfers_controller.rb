class Sessions::TransfersController < ApplicationController
  disallow_account_scope
  require_unauthenticated_access

  def show
  end

  def update
    if identity = Identity.find_by_transfer_id(params[:id])
      start_new_session_for identity
      identify_identity_with_posthog
      PostHog.capture(
        distinct_id: Current.identity.posthog_distinct_id,
        event: "session_transferred"
      )
      redirect_to session_menu_path(script_name: nil)
    else
      head :bad_request
    end
  end
end
