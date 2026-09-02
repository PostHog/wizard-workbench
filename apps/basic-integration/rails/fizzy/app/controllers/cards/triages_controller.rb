class Cards::TriagesController < ApplicationController
  include CardScoped

  def create
    column = @card.board.columns.find(params[:column_id])
    @card.triage_into(column)

    if defined?(PostHog)
      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: "card_triaged"
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
