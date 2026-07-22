class Cards::TaggingsController < ApplicationController
  include CardScoped

  def new
    @tagged_with = @card.tags.alphabetically
    @tags = Current.account.tags.all.alphabetically.where.not(id: @tagged_with)
    fresh_when etag: [ @tags, @card.tags ]
  end

  def create
    @card.toggle_tag_with sanitized_tag_title_param
    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "card_tag_toggled",
      properties: { card_id: @card.id, board_id: @board.id }
    )

    respond_to do |format|
      format.turbo_stream
      format.json { head :no_content }
    end
  end

  private
    def sanitized_tag_title_param
      params.required(:tag_title).strip.gsub(/\A#/, "")
    end
end
