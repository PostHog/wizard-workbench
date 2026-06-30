class ApplicationController < ActionController::Base
  include Authentication
  include Authorization
  include BlockSearchEngineIndexing
  include CurrentRequest, CurrentTimezone, SetPlatform
  include RequestForgeryProtection
  include TurboFlash, ViewTransitions
  include RoutingHeaders

  helper_method :current_user

  etag { "v1" }
  stale_when_importmap_changes
  allow_browser versions: :modern

  private
    def current_user
      Current.user
    end
end
