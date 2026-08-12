class Webhooks::ActivationsController < ApplicationController
  include BoardScoped

  before_action :ensure_admin

  def create
    webhook = @board.webhooks.find(params[:webhook_id])
    webhook.activate

    PostHog.capture(
      distinct_id: Current.identity.posthog_distinct_id,
      event: "webhook_activated",
      properties: { webhook_id: webhook.id, board_id: @board.id }
    )

    redirect_to webhook
  end
end
