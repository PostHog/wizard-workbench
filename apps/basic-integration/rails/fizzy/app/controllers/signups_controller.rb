class SignupsController < ApplicationController
  include PosthogTrackable
  disallow_account_scope
  allow_unauthenticated_access
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_signup_path, alert: "Try again later." }
  before_action :redirect_authenticated_user
  before_action :enforce_tenant_limit

  layout "public"

  def new
    @signup = Signup.new
  end

  def create
    signup = Signup.new(signup_params)
    if signup.valid?(:identity_creation)
      identity = signup.create_identity

      PostHog.capture(
        distinct_id: PosthogTrackable.distinct_id_for_identity(identity),
        event: "signup_started",
        properties: {
          signup_method: "email"
        }
      )

      redirect_to_session_magic_link identity
    else
      head :unprocessable_entity
    end
  rescue => e
    PostHog.capture_exception(e, PosthogTrackable.distinct_id_for_identity(signup&.identity || identity))
    raise
  end

  private
    def redirect_authenticated_user
      redirect_to new_signup_completion_path if authenticated?
    end

    def enforce_tenant_limit
      redirect_to new_session_url unless Account.accepting_signups?
    end

    def signup_params
      params.expect signup: :email_address
    end
end
