class FiltersController < ApplicationController
  before_action :set_filters

  def create
    @filter = Current.user.filters.remember filter_params
  end

  def destroy
    @filter = Current.user.filters.find(params[:id])
    @filter.destroy!
  end

  private
    def set_filters
      @filters = Current.user.filters
    end

    def filter_params
      Filter.normalize_params(params.permit(*Filter::PERMITTED_PARAMS))
    end
end
