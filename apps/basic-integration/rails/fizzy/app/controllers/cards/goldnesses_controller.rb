class Cards::GoldnessesController < ApplicationController
  include CardScoped

  def create
    @card.gild

    PostHog.capture(
      distinct_id: Current.identity.id,
      event: "card_gilded",
      properties: { card_id: @card.id, board_id: @board.id }
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
