class Account::CancellationsController < ApplicationController
  before_action :ensure_owner

  def create
    # PostHog: Capture churn event before cancellation while identity is still available
    PostHog.capture(
      distinct_id: Current.identity.email_address,
      event: "account_cancelled",
      properties: { account_id: Current.account.id.to_s }
    )

    Current.account.cancel
    redirect_to session_menu_path(script_name: nil), notice: "Account deleted"
  end

  private
    def ensure_owner
      head :forbidden unless Current.user.owner?
    end
end
