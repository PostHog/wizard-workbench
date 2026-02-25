class Boards::PublicationsController < ApplicationController
  include BoardScoped

  before_action :ensure_permission_to_admin_board

  def create
    @board.publish

    # PostHog: Track when a board is made publicly accessible
    PostHog.capture(
      distinct_id: Current.identity.email_address,
      event: "board_published",
      properties: { board_id: @board.id.to_s }
    )
  end

  def destroy
    @board.unpublish
    @board.reload
  end
end
