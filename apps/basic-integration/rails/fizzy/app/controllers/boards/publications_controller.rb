class Boards::PublicationsController < ApplicationController
  include BoardScoped

  before_action :ensure_permission_to_admin_board

  def create
    @board.publish

    PostHog.capture(
      distinct_id: Current.identity.posthog_distinct_id,
      event: "board_published",
      properties: { board_id: @board.id }
    ) if defined?(PostHog)
  end

  def destroy
    @board.unpublish

    PostHog.capture(
      distinct_id: Current.identity.posthog_distinct_id,
      event: "board_unpublished",
      properties: { board_id: @board.id }
    ) if defined?(PostHog)
    @board.reload
  end
end
