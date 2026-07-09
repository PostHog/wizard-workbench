class Cards::NotNowsController < ApplicationController
  include CardScoped

  def create
    capture_card_location
    @card.postpone
    refresh_stream_if_needed

    PostHog.capture(
      distinct_id: Current.identity.id,
      event: "card_postponed",
      properties: { card_id: @card.id, board_id: @board.id }
    )

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end
end
