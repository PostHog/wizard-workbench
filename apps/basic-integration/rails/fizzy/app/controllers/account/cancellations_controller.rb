class Account::CancellationsController < ApplicationController
  before_action :ensure_owner

  def create
    Current.account.cancel

    if ENV["POSTHOG_PROJECT_TOKEN"].present?
      PostHog.capture(
        distinct_id: Current.identity.posthog_distinct_id,
        event: "account_cancelled"
      )
    end

    redirect_to session_menu_path(script_name: nil), notice: "Account deleted"
  end

  private
    def ensure_owner
      head :forbidden unless Current.user.owner?
    end
end
