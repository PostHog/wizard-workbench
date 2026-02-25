class Cards::ClosuresController < ApplicationController
  include CardScoped

  def create
    capture_card_location
    @card.close
    refresh_stream_if_needed

    # PostHog: Track card closure — key workflow completion signal
    PostHog.capture(
      distinct_id: Current.identity.email_address,
      event: "card_closed",
      properties: {
        card_id: @card.id.to_s,
        board_id: @board.id.to_s
      }
    )

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end

  def destroy
    @card.reopen
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
