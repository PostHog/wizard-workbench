class Account::ImportsController < ApplicationController
  layout "public"

  disallow_account_scope only: %i[ new create ]
  allow_unauthorized_access only: :show
  before_action :set_import, only: %i[ show ]
  before_action :ensure_accessed_by_owner, only: %i[ show ]

  def new
  end

  def create
    signup = Signup.new(identity: Current.identity, full_name: "Import", skip_account_seeding: true)

    if signup.complete
      PostHog.capture(
        distinct_id: signup.user.posthog_distinct_id,
        event: "account_import_started",
        properties: {
          source: "upload",
          account_id: signup.account.external_account_id,
          has_file: params[:file].present?
        }
      )

      start_import(signup.account)
    else
      render :new, alert: "Couldn't create account."
    end
  rescue => error
    PostHog.capture_exception(error, Current.identity&.id || "account-import", action: "account_import_started")
    raise
  end

  def show
  end

  private
    def set_import
      @import = Current.account.imports.find(params[:id])
    end

    def ensure_accessed_by_owner
      head :forbidden unless @import.identity == Current.identity
    end

    def start_import(account)
      import = nil

      Current.set(account: account) do
        import = account.imports.create!(identity: Current.identity, file: params[:file])
        import.process_later
      end

      redirect_to account_import_path(import, script_name: account.slug)
    end
end
