class Events::DayTimeline::ColumnsController < ApplicationController
  include DayTimelinesScoped

  before_action :ensure_valid_column
  before_action :set_column

  def show
    fresh_when @day_timeline
  end

  private
    VALID_COLUMNS = %w[ added updated closed ]

    def ensure_valid_column
      head :not_found unless VALID_COLUMNS.include?(params[:id])
    end

    def set_column
      @column = @day_timeline.public_send("#{params[:id]}_column")
    end
end
