class Boards::PublicationsController < ApplicationController
  include BoardScoped

  before_action :ensure_permission_to_admin_board

  def create
    @board.publish
    if posthog_enabled?
      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: "board_published",
        properties: { board_id: @board.id }
      )
    end
  end

  def destroy
    @board.unpublish
    @board.reload
    if posthog_enabled?
      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: "board_unpublished",
        properties: { board_id: @board.id }
      )
    end
  end
end
