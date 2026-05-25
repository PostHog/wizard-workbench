class Cards::PublishesController < ApplicationController
  include CardScoped

  def create
    @card.publish

    PostHog.capture(
      distinct_id: Current.identity.posthog_distinct_id,
      event: "card_created",
      properties: { board_name: @board.name, card_title: @card.title }
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
