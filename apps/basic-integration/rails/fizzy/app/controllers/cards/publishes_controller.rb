class Cards::PublishesController < ApplicationController
  include CardScoped

  def create
    @card.publish

    if ENV["POSTHOG_PROJECT_TOKEN"].present? && ENV["POSTHOG_HOST"].present?
      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: "card_published",
        properties: { card_id: @card.id, board_id: @card.board_id, add_another: add_another_param? }
      )
    end

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
