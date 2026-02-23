class Account::CancellationsController < ApplicationController
  before_action :ensure_owner

  def create
    # PostHog: Track account cancellation before destroying — most critical churn event
    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "account_cancelled",
      properties: {
        account_id: Current.account.id,
        account_name: Current.account.name
      }
    )

    Current.account.cancel
    redirect_to session_menu_path(script_name: nil), notice: "Account deleted"
  end

  private
    def ensure_owner
      head :forbidden unless Current.user.owner?
    end
end
