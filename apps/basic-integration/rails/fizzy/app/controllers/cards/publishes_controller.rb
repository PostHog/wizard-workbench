class Cards::PublishesController < ApplicationController
  include CardScoped

  def create
    @card.publish

    PostHog.capture(
      distinct_id: Current.identity.email_address,
      event: "card_created",
      properties: { card_id: @card.id, card_number: @card.number, board_id: @board.id, board_name: @board.name }
    )

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
