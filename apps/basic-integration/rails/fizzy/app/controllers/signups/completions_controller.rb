class Signups::CompletionsController < ApplicationController
  layout "public"

  disallow_account_scope

  def new
    @signup = Signup.new(identity: Current.identity)
  end

  def create
    @signup = Signup.new(signup_params)

    if @signup.complete
      welcome_to_account
    else
      invalid_signup
    end
  end

  private
    def signup_params
      params.expect(signup: %i[ full_name ]).with_defaults(identity: Current.identity)
    end

    def welcome_to_account
      identify_posthog_user(@signup.user)
      capture_posthog_event "account_signup_completed"

      respond_to do |format|
        format.html do
          flash[:welcome_letter] = true
          redirect_to landing_url(script_name: @signup.account.slug)
        end

        format.json { render json: { account_id: @signup.account.id }, status: :created }
      end
    end

    def identify_posthog_user(user)
      return unless ENV["POSTHOG_PROJECT_TOKEN"].present? && ENV["POSTHOG_HOST"].present?

      PostHog.identify(
        distinct_id: user.posthog_distinct_id,
        properties: user.posthog_properties
      )
    end

    def invalid_signup
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { errors: @signup.errors.full_messages }, status: :unprocessable_entity }
      end
    end
end
