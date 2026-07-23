class Cards::TriagesController < ApplicationController
  include CardScoped

  def create
    column = @card.board.columns.find(params[:column_id])
    @card.triage_into(column)

    if ENV["POSTHOG_PROJECT_TOKEN"].present?
      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: "card_triaged",
        properties: { card_id: @card.id.to_s, board_id: @board.id.to_s, column_id: column.id.to_s }
      )
    end

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
