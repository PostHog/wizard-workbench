class Cards::WatchesController < ApplicationController
  include CardScoped

  def show
    fresh_when etag: @card.watch_for(Current.user) || "none"
  end

  def create
    @card.watch_by Current.user
    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "card_watch_started",
      properties: { card_id: @card.id, board_id: @board.id }
    )

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end

  def destroy
    @card.unwatch_by Current.user
    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "card_watch_stopped",
      properties: { card_id: @card.id, board_id: @board.id }
    )

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end
end
