class ApplicationController < ActionController::Base
  include Authentication
  include Authorization
  include BlockSearchEngineIndexing
  include CurrentRequest, CurrentTimezone, SetPlatform
  include RequestForgeryProtection
  include TurboFlash, ViewTransitions
  include RoutingHeaders

  etag { "v1" }
  stale_when_importmap_changes
  allow_browser versions: :modern

  private
    # posthog-rails calls this for exception context. Current.identity is set
    # for both cookie sessions and bearer-token authentication.
    def current_identity
      Current.identity
    end
end
