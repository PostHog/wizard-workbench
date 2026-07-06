class Users::VerificationsController < ApplicationController
  include PosthogTrackable
  layout "public"

  def new
  end

  def create
    Current.user.verify

    PostHog.capture(
      distinct_id: Current.user.posthog_distinct_id,
      event: "user_verified",
      properties: {
        account_id: Current.account.id,
        verification_state: "verified"
      }
    )

    redirect_to new_users_join_path
  end
end
