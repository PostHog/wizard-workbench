class Webhooks::ActivationsController < ApplicationController
  include BoardScoped

  before_action :ensure_admin

  def create
    webhook = @board.webhooks.find(params[:webhook_id])
    webhook.activate

    if PostHog.initialized?
      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: "webhook_activated"
      )
    end

    redirect_to webhook
  end
end
