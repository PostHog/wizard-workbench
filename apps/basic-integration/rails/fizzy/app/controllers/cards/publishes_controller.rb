class Cards::PublishesController < ApplicationController
  include CardScoped

  def create
    @card.publish

    posthog_capture(
      "card_published",
      {
        card_id: @card.id,
        board_id: @board.id,
        creation_type: params[:creation_type]
      }
    )

    if add_another_param?
      card = @board.cards.create!(status: :drafted)
      redirect_to card_draft_path(card), notice: "Card added"
    else
      redirect_to @card.board
    end
  rescue => error
    PostHog.capture_exception(error, Current.user.posthog_distinct_id, { controller: self.class.name, action: "create" }) if Current.user
    raise
  end

  private
    def add_another_param?
      params[:creation_type] == "add_another"
    end
end
