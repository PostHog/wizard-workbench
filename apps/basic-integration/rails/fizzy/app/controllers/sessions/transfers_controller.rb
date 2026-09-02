class Sessions::TransfersController < ApplicationController
  disallow_account_scope
  require_unauthenticated_access

  def show
  end

  def update
    if identity = Identity.find_by_transfer_id(params[:id])
      start_new_session_for identity
      identify_identity(identity)
      redirect_to session_menu_path(script_name: nil)
    else
      head :bad_request
    end
  end

  private
    def identify_identity(identity)
      return unless defined?(PostHog)

      PostHog.identify(
        distinct_id: identity.posthog_distinct_id,
        properties: identity.posthog_properties
      )
    end
end
