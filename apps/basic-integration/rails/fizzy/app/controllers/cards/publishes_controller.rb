class Cards::PublishesController < ApplicationController
  include CardScoped

  def create
    @card.publish
    capture_posthog_event "card_published", properties: { board_id: @card.board_id, card_number: @card.number }

    if add_another_param?
      card = @board.cards.create!(status: :drafted)
      redirect_to card_draft_path(card), notice: "Card added"
    else
      redirect_to @card.board
    end
  end

  private
    def add_another_param?
      params[:creation_type] == "add_another"
    end
end
