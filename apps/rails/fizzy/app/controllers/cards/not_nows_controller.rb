class Cards::NotNowsController < ApplicationController
  include CardScoped

  def create
    capture_card_location
    @card.postpone
    refresh_stream_if_needed

    # PostHog: Track card postponement to the "not now" list
    PostHog.capture(
      distinct_id: Current.identity.email_address,
      event: "card_postponed",
      properties: {
        card_id: @card.id.to_s,
        board_id: @board.id.to_s
      }
    )

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end
end
