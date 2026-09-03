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
    def current_user
      Current.user
    end

    def capture_posthog(**event)
      PostHog.capture(**event) if Rails.configuration.x.posthog.configured
    end

    def identify_posthog(**person)
      PostHog.identify(**person) if Rails.configuration.x.posthog.configured
    end
end
