class Cards::AssignmentsController < ApplicationController
  include CardScoped

  def new
    @assigned_to = @card.assignees.active.alphabetically.where.not(id: Current.user)
    @users = @board.users.active.alphabetically.where.not(id: @card.assignees).where.not(id: Current.user)
    fresh_when etag: [ @users, @card.assignees ]
  end

  def create
    assignee = @board.users.active.find(params[:assignee_id])

    if @card.toggle_assignment assignee
      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: "card_assigned",
        properties: { card_id: @card.id, card_number: @card.number, board_id: @card.board_id, assignee_id: assignee.posthog_distinct_id }
      )

      respond_to do |format|
        format.turbo_stream
        format.json { head :no_content }
      end
    else
      respond_to do |format|
        format.turbo_stream
        format.json { head :unprocessable_entity }
      end
    end
  end
end
