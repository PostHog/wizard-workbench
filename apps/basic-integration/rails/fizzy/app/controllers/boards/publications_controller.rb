class Boards::PublicationsController < ApplicationController
  include BoardScoped

  before_action :ensure_permission_to_admin_board

  def create
    @board.publish
    capture_posthog_event "board_published"
  end

  def destroy
    @board.unpublish
    @board.reload
    capture_posthog_event "board_unpublished"
  end
end
