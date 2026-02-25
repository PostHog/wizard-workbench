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
    # Provided for posthog-rails compatibility — it expects a current_user method
    # on the controller to associate errors with the authenticated user.
    def current_user
      Current.user
    end
    helper_method :current_user
end
