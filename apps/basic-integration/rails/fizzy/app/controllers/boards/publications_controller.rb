class Boards::PublicationsController < ApplicationController
  include BoardScoped

  before_action :ensure_permission_to_admin_board

  def create
    @board.publish
    if Rails.configuration.x.posthog.enabled
      PostHog.capture(
        distinct_id: Current.identity.posthog_distinct_id,
        event: "board_published"
      )
    end
  end

  def destroy
    @board.unpublish
    if Rails.configuration.x.posthog.enabled
      PostHog.capture(
        distinct_id: Current.identity.posthog_distinct_id,
        event: "board_unpublished"
      )
    end
    @board.reload
  end
end
