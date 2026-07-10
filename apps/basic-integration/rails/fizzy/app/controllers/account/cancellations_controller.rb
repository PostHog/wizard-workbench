class Account::CancellationsController < ApplicationController
  before_action :ensure_owner

  def create
    account_id = Current.account.external_account_id

    Current.account.cancel

    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "account_cancelled",
      properties: {
        account_id: account_id,
        user_role: Current.user.role
      }
    )

    redirect_to session_menu_path(script_name: nil), notice: "Account deleted"
  end

  private
    def ensure_owner
      head :forbidden unless Current.user.owner?
    end
end
