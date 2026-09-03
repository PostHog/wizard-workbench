class Users::JoinsController < ApplicationController
  layout "public"

  def new
  end

  def create
    Current.user.update!(user_params)

    capture_posthog(
      distinct_id: Current.user.posthog_distinct_id,
      event: "account_profile_completed",
      properties: { account_id: Current.user.account_id }
    )

    redirect_to landing_path
  end

  private
    def user_params
      params.expect(user: [ :name, :avatar ])
    end
end
