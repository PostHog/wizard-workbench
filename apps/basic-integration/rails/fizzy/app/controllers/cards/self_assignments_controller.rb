class Cards::SelfAssignmentsController < ApplicationController
  include CardScoped

  def create
    if @card.toggle_assignment(Current.user)
      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: "card_self_assignment_changed",
        properties: { board_id: @board.id }
      )
      respond_to do |format|
        format.turbo_stream { render "cards/assignments/create" }
        format.json { head :no_content }
      end
    else
      respond_to do |format|
        format.turbo_stream { render "cards/assignments/create" }
        format.json { head :unprocessable_entity }
      end
    end
  end
end
