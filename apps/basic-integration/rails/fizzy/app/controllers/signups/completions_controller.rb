class Signups::CompletionsController < ApplicationController
  layout "public"

  disallow_account_scope

  def new
    @signup = Signup.new(identity: Current.identity)
  end

  def create
    @signup = Signup.new(signup_params)

    if @signup.complete
      identify_new_user
      capture_posthog_event("signup_completed", user: @signup.user)
      welcome_to_account
    else
      invalid_signup
    end
  end

  private
    def identify_new_user
      return unless ENV["POSTHOG_PROJECT_TOKEN"].present? && ENV["POSTHOG_HOST"].present?

      PostHog.identify(
        distinct_id: @signup.user.posthog_distinct_id,
        properties: @signup.user.posthog_properties
      )
    rescue StandardError => error
      Rails.logger.warn("PostHog user identification failed: #{error.message}")
    end

    def signup_params
      params.expect(signup: %i[ full_name ]).with_defaults(identity: Current.identity)
    end

    def welcome_to_account
      respond_to do |format|
        format.html do
          flash[:welcome_letter] = true
          redirect_to landing_url(script_name: @signup.account.slug)
        end

        format.json { render json: { account_id: @signup.account.id }, status: :created }
      end
    end

    def invalid_signup
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { errors: @signup.errors.full_messages }, status: :unprocessable_entity }
      end
    end
end
