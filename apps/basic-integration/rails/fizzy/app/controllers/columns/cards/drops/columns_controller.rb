class Columns::Cards::Drops::ColumnsController < ApplicationController
  include CardScoped

  def create
    @column = @card.board.columns.find(params[:column_id])
    @card.triage_into(@column)
    capture_posthog_event "card_moved_to_column", properties: { board_id: @card.board_id, card_number: @card.number, column_id: @column.id }
  end
end
