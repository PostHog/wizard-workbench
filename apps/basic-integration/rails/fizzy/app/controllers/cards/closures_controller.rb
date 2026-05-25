class Cards::ClosuresController < ApplicationController
  include CardScoped

  def create
    capture_card_location
    @card.close

    PostHog.capture(
      distinct_id: Current.identity.posthog_distinct_id,
      event: "card_closed",
      properties: { board_name: @board.name, card_title: @card.title }
    )

    refresh_stream_if_needed

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end

  def destroy
    @card.reopen

    PostHog.capture(
      distinct_id: Current.identity.posthog_distinct_id,
      event: "card_reopened",
      properties: { board_name: @board.name, card_title: @card.title }
    )

    refresh_stream_after_reopen

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end

  private
    def refresh_stream_after_reopen
      if @card.awaiting_triage?
        set_page_and_extract_portion_from @board.cards.awaiting_triage.latest.with_golden_first.preloaded
      end
    end
end
