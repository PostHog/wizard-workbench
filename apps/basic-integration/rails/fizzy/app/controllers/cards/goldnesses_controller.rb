class Cards::GoldnessesController < ApplicationController
  include CardScoped

  def create
    @card.gild

    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "card_gilded",
      properties: { card_id: @card.id, card_number: @card.number, board_id: @board.id }
    )

    respond_to do |format|
      format.turbo_stream { render_card_replacement }
      format.json { head :no_content }
    end
  end

  def destroy
    @card.ungild

    respond_to do |format|
      format.turbo_stream { render_card_replacement }
      format.json { head :no_content }
    end
  end
end
