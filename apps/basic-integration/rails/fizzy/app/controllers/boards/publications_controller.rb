class Boards::PublicationsController < ApplicationController
  include BoardScoped

  before_action :ensure_permission_to_admin_board

  def create
    @board.publish
    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "board_published"
    )
  end

  def destroy
    @board.unpublish
    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "board_unpublished"
    )
    @board.reload
  end
end
