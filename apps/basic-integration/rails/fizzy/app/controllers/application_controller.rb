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
      Current.user || Current.identity
    end

    def capture_with_posthog(event, actor: Current.user || Current.identity, properties: {})
      return unless ENV["POSTHOG_PROJECT_TOKEN"].present? && ENV["POSTHOG_HOST"].present?
      return unless actor&.posthog_distinct_id.present?

      PostHog.capture(
        distinct_id: actor.posthog_distinct_id,
        event: event,
        properties: properties
      )
    rescue StandardError => error
      Rails.logger.warn("PostHog capture failed: #{error.class}")
    end
end
