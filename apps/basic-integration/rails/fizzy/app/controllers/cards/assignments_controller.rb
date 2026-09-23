class Cards::AssignmentsController < ApplicationController
  include CardScoped

  def new
    @assigned_to = @card.assignees.active.alphabetically.where.not(id: Current.user)
    @users = @board.users.active.alphabetically.where.not(id: @card.assignees).where.not(id: Current.user)
    fresh_when etag: [ @users, @card.assignees ]
  end

  def create
    assignee = @board.users.active.find(params[:assignee_id])
    assignment_action = @card.assigned_to?(assignee) ? "removed" : "added"

    if @card.toggle_assignment assignee
      capture_posthog(
        distinct_id: Current.user.posthog_distinct_id,
        event: "card_assignment_changed",
        properties: { assignment_action: assignment_action }
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
