class Cards::NotNowsController < ApplicationController
  include CardScoped

  def create
    capture_card_location
    @card.postpone

    if ENV["POSTHOG_PROJECT_TOKEN"].present?
      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: "card_postponed",
        properties: { card_id: @card.id.to_s, board_id: @board.id.to_s }
      )
    end

    refresh_stream_if_needed

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end
end
