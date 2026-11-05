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
    # posthog-rails calls this once per request when associating captured errors.
    def posthog_current_user
      Current.user
    end

    # The dedicated provider in the PostHog initializer exports only these
    # explicit, non-PII lifecycle messages; Rails.logger remains untouched.
    def posthog_log(message, attributes = {})
      Rails.configuration.x.posthog_log_logger&.emit(
        severity_text: "INFO",
        body: message,
        attributes: attributes
      )
    end
end
