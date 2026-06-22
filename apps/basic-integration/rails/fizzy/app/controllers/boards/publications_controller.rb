class Boards::PublicationsController < ApplicationController
  include BoardScoped

  before_action :ensure_permission_to_admin_board

  def create
    @board.publish

    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "board_published_publicly",
      properties: { board_name: @board.name }
    )
  end

  def destroy
    @board.unpublish
    @board.reload
  end
end
