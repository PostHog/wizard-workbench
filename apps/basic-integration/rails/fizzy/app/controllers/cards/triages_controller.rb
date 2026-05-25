class Cards::TriagesController < ApplicationController
  include CardScoped

  def create
    column = @card.board.columns.find(params[:column_id])
    @card.triage_into(column)

    PostHog.capture(
      distinct_id: Current.identity.posthog_distinct_id,
      event: "card_triaged",
      properties: { board_name: @board.name, card_title: @card.title, column_name: column.name }
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
