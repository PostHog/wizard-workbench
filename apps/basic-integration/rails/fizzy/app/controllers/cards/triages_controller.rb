class Cards::TriagesController < ApplicationController
  include CardScoped

  def create
    column = @card.board.columns.find(params[:column_id])
    @card.triage_into(column)

    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "card_triaged",
      properties: { card_title: @card.title, column_name: column.name, board_name: @board.name }
    )

    respond_to do |format|
      format.html { redirect_to @card }
      format.json { head :no_content }
    end
  end

  def destroy
    @card.send_back_to_triage

    respond_to do |format|
      format.html { redirect_to @card }
      format.json { head :no_content }
    end
  end
end
