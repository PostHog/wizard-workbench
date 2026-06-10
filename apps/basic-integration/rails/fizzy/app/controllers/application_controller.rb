class ApplicationController < ActionController::Base
  include Authentication
  include Authorization
  include BlockSearchEngineIndexing
  include CurrentRequest, CurrentTimezone, SetPlatform
  include RequestForgeryProtection
  include TurboFlash, ViewTransitions
  include RoutingHeaders

  around_action :capture_exceptions_for_posthog

  etag { "v1" }
  stale_when_importmap_changes
  allow_browser versions: :modern

  private
    def capture_exceptions_for_posthog
      yield
    rescue StandardError => e
      PostHog.capture(
        distinct_id: Current.identity&.id || "anonymous",
        event: "$exception",
        properties: {
          "$exception_message" => e.message,
          "$exception_type" => e.class.name,
        }
      )
      raise
    end
end
