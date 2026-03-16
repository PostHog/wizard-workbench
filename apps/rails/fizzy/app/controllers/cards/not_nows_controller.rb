class Cards::NotNowsController < ApplicationController
  include CardScoped

  def create
    capture_card_location
    @card.postpone
    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "card_postponed",
      properties: { card_id: @card.id, board_id: @card.board_id }
    )
    refresh_stream_if_needed

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end
end
