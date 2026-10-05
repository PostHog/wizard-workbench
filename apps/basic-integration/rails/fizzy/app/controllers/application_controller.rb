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

    def capture_posthog_event(event, properties: {})
      return unless ENV["POSTHOG_PROJECT_TOKEN"].present? && ENV["POSTHOG_HOST"].present?

      PostHog.capture(
        distinct_id: Current.user.posthog_distinct_id,
        event: event,
        properties: properties
      )
    end
end
