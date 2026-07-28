class Webhooks::ActivationsController < ApplicationController
  include BoardScoped

  before_action :ensure_admin

  def create
    webhook = @board.webhooks.find(params[:webhook_id])
    webhook.activate

    if ENV["POSTHOG_PROJECT_TOKEN"].present?
      PostHog.capture(
        distinct_id: Current.identity.posthog_distinct_id,
        event: "webhook_activated",
        properties: { board_id: @board.id }
      )
    end

    redirect_to webhook
  end
end
