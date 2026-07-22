class Cards::ClosuresController < ApplicationController
  include CardScoped

  def create
    capture_card_location
    @card.close

    if PostHog.initialized?
      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: "card_closed"
      )
    end

    refresh_stream_if_needed

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end

  def destroy
    @card.reopen

    if PostHog.initialized?
      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: "card_reopened"
      )
    end

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
