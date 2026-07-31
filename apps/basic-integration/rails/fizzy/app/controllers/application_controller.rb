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
    # posthog-rails uses this request-scoped identity for automatic exception capture.
    def current_posthog_user
      Current.user || Current.identity
    end

    def capture_posthog_event(event, properties = {})
      return unless ENV["POSTHOG_PROJECT_TOKEN"].present? && ENV["POSTHOG_HOST"].present?

      user = current_posthog_user
      return unless user

      PostHog.capture(distinct_id: user.posthog_distinct_id, event: event, properties: properties)
    end
end
