class SignupsController < ApplicationController
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
      magic_link = signup.create_identity

      PostHog.capture(
        distinct_id: signup.identity.id,
        event: "signup_started",
        properties: {
          flow: "email",
          account_accepting_signups: true
        }
      )

      redirect_to_session_magic_link magic_link
    else
      head :unprocessable_entity
    end
  rescue => error
    PostHog.capture_exception(error, signup.identity&.id || signup.email_address, action: "signup_started")
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
