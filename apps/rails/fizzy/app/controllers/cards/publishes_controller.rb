class Cards::PublishesController < ApplicationController
  include CardScoped

  def create
    @card.publish

    # PostHog: Track card publication — draft becoming a live task on the board
    PostHog.capture(
      distinct_id: Current.identity.email_address,
      event: "card_published",
      properties: {
        card_id: @card.id.to_s,
        board_id: @board.id.to_s
      }
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
