class Webhooks::ActivationsController < ApplicationController
  include BoardScoped

  before_action :ensure_admin

  def create
    webhook = @board.webhooks.find(params[:webhook_id])
    webhook.activate
    if Rails.configuration.x.posthog.enabled
      PostHog.capture(
        distinct_id: Current.identity.posthog_distinct_id,
        event: "webhook_activated",
        properties: { webhook_id: webhook.id, board_id: @board.id }
      )
    end

    redirect_to webhook
  end
end
