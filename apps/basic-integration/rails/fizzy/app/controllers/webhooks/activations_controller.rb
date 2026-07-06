class Webhooks::ActivationsController < ApplicationController
  include PosthogTrackable
  include BoardScoped

  before_action :ensure_admin

  def create
    webhook = @board.webhooks.find(params[:webhook_id])
    webhook.activate

    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "webhook_activated",
      properties: {
        account_id: Current.account.id,
        board_id: @board.id,
        webhook_id: webhook.id
      }
    )

    redirect_to webhook
  end
end
