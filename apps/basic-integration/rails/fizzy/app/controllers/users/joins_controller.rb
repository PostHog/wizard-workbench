class Users::JoinsController < ApplicationController
  layout "public"

  def new
  end

  def create
    Current.user.update!(user_params)
    capture_posthog(
      distinct_id: Current.user.posthog_distinct_id,
      event: "profile_completed"
    )
    redirect_to landing_path
  end

  private
    def user_params
      params.expect(user: [ :name, :avatar ])
    end
end
