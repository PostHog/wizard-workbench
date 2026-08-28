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

    def posthog_capture(event)
      PostHog.capture(event) if posthog_configured?
    end

    def posthog_identify(person)
      PostHog.identify(person) if posthog_configured?
    end

    def posthog_configured?
      ENV["POSTHOG_PROJECT_TOKEN"].present? && ENV["POSTHOG_HOST"].present?
    end
end
