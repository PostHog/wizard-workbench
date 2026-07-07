class Cards::NotNowsController < ApplicationController
  include CardScoped

  def create
    capture_card_location
    @card.postpone

    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "card_postponed",
      properties: { board_name: @board.name, card_number: @card.number }
    )

    refresh_stream_if_needed

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end
end
