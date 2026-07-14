class Users::DataExportsController < ApplicationController
  before_action :set_user
  before_action :ensure_current_user
  before_action :ensure_export_limit_not_exceeded, only: :create
  before_action :set_export, only: :show

  CURRENT_EXPORT_LIMIT = 10

  def show
  end

  def create
    @user.data_exports.create!(account: Current.account).build_later

    PostHog.capture({
      distinct_id: @user.posthog_distinct_id,
      event: "data_export_requested",
      properties: {
        account_id: Current.account.id,
        export_scope: "user"
      }
    })

    redirect_to @user, notice: "Export started. You'll receive an email when it's ready."
  end

  private
    def set_user
      @user = Current.account.users.find(params[:user_id])
    end

    def ensure_current_user
      head :forbidden unless @user == Current.user
    end

    def ensure_export_limit_not_exceeded
      head :too_many_requests if @user.data_exports.current.count >= CURRENT_EXPORT_LIMIT
    end

    def set_export
      @export = @user.data_exports.completed.find_by(id: params[:id])
    end
end
