class Events::DaysController < ApplicationController
  include DayTimelinesScoped

  def index
    fresh_when @day_timeline
  end
end
