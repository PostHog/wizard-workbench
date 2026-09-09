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
    def capture_posthog_event(...)
      PostHog.capture(...) if Rails.configuration.x.posthog_enabled
    end

    def posthog_current_user
      Current.user
    end
end
