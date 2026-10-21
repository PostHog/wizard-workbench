class Boards::PublicationsController < ApplicationController
  include BoardScoped

  before_action :ensure_permission_to_admin_board

  def create
    @board.publish

    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "board_published"
    ) if ENV["POSTHOG_PROJECT_TOKEN"].present? && ENV["POSTHOG_HOST"].present?
  end

  def destroy
    @board.unpublish
    @board.reload

    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "board_unpublished"
    ) if ENV["POSTHOG_PROJECT_TOKEN"].present? && ENV["POSTHOG_HOST"].present?
  end
end
