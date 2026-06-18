class Cards::GoldnessesController < ApplicationController
  include CardScoped

  def create
    @card.gild

    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "card_gilded",
      properties: { card_title: @card.title, board_name: @board.name }
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
