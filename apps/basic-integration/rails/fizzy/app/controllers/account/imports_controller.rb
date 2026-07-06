class Account::ImportsController < ApplicationController
  include PosthogTrackable
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
      start_import(signup.account)
    else
      render :new, alert: "Couldn't create account."
    end
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
      distinct_id = PosthogTrackable.distinct_id_for_identity(Current.identity)

      Current.set(account: account) do
        import = account.imports.create!(identity: Current.identity, file: params[:file])
        import.process_later
      end

      PostHog.capture(
        distinct_id: distinct_id,
        event: "account_import_started",
        properties: {
          account_id: account.id,
          account_slug: account.slug,
          import_id: import.id
        }
      )

      redirect_to account_import_path(import, script_name: account.slug)
    rescue => e
      PostHog.capture_exception(e, distinct_id)
      raise
    end
  end
end
