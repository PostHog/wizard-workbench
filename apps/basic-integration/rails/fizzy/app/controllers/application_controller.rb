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
    # posthog-rails calls this for request-level exception attribution.
    def current_user
      Current.user
    end

    def capture_posthog_event(event, user: Current.user, properties: {})
      return unless user && ENV["POSTHOG_PROJECT_TOKEN"].present? && ENV["POSTHOG_HOST"].present?

      PostHog.capture(
        distinct_id: user.posthog_distinct_id,
        event: event,
        properties: properties
      )
    rescue StandardError => error
      Rails.logger.warn("PostHog event capture failed: #{error.message}")
    end

    def emit_posthog_log(body, attributes = {})
      posthog_logger = Rails.configuration.x.posthog_logs_logger
      return unless posthog_logger

      posthog_logger.emit(
        severity_text: "INFO",
        body: body,
        attributes: attributes
      )
    rescue StandardError => error
      Rails.logger.warn("PostHog log capture failed: #{error.message}")
    end
end
