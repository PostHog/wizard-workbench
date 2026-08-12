class Users::JoinsController < ApplicationController
  layout "public"

  def new
  end

  def create
    Current.user.update!(user_params)

    PostHog.capture(
      distinct_id: Current.identity.posthog_distinct_id,
      event: "profile_setup_completed",
      properties: { user_id: Current.user.id, account_id: Current.account.id }
    )

    redirect_to landing_path
  end

  private
    def user_params
      params.expect(user: [ :name, :avatar ])
    end
end
