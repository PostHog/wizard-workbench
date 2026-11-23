class ApplicationController < ActionController::Base
  include Authentication
  include Authorization
  include BlockSearchEngineIndexing
  include CurrentRequest, CurrentTimezone, SetPlatform
  include RequestForgeryProtection
  include TurboFlash, ViewTransitions
  include RoutingHeaders

  # posthog-rails calls this to associate request errors with the authenticated user.
  def current_user
    Current.user
  end

  etag { "v1" }
  stale_when_importmap_changes
  allow_browser versions: :modern
end
