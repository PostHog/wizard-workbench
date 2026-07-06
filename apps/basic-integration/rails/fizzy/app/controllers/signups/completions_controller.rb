class Signups::CompletionsController < ApplicationController
  include PosthogTrackable
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
      distinct_id = PosthogTrackable.distinct_id_for_identity(Current.identity)

      PostHog.identify(
        distinct_id: distinct_id,
        properties: {
          account_id: @signup.account.id,
          account_slug: @signup.account.slug,
          name: Current.identity&.user&.name,
          verified: Current.identity&.user&.verified?
        }.compact
      )

      PostHog.capture(
        distinct_id: distinct_id,
        event: "signup_completed",
        properties: {
          account_id: @signup.account.id,
          account_slug: @signup.account.slug
        }
      )

      respond_to do |format|
        format.html do
          flash[:welcome_letter] = true
          redirect_to landing_url(script_name: @signup.account.slug)
        end

        format.json { render json: { account_id: @signup.account.id }, status: :created }
      end
    rescue => e
      PostHog.capture_exception(e, distinct_id)
      raise
    end

    def invalid_signup
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { errors: @signup.errors.full_messages }, status: :unprocessable_entity }
      end
    end
end
