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
      posthog_track_signup

      respond_to do |format|
        format.html do
          flash[:welcome_letter] = true
          redirect_to landing_url(script_name: @signup.account.slug)
        end

        format.json { render json: { account_id: @signup.account.id }, status: :created }
      end
    end

    def posthog_track_signup
      user = @signup.user
      return unless user

      PostHog.identify(
        distinct_id: user.posthog_distinct_id,
        properties: user.posthog_properties
      )

      PostHog.capture(
        distinct_id: user.posthog_distinct_id,
        event: "signed_up",
        properties: { account_id: @signup.account.id }
      )
    end

    def invalid_signup
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { errors: @signup.errors.full_messages }, status: :unprocessable_entity }
      end
    end
end
