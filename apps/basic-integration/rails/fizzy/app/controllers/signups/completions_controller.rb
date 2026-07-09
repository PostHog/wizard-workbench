class Signups::CompletionsController < ApplicationController
  layout "public"

  disallow_account_scope

  def new
    @signup = Signup.new(identity: Current.identity)
  end

  def create
    @signup = Signup.new(signup_params)

    if @signup.complete
      posthog_identify(@signup.user)
      posthog_capture(
        "user_signed_up",
        {
          signup_method: "magic_link",
          account_id: @signup.account.id
        },
        user: @signup.user
      )
      welcome_to_account
    else
      invalid_signup
    end
  rescue => error
    PostHog.capture_exception(error, Current.identity&.id || "anonymous_signup_completion", { controller: self.class.name, action: "create" })
    raise
  end

  private
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
