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

    def posthog_identify(user = Current.user)
      return unless user

      PostHog.identify(
        distinct_id: user.posthog_distinct_id,
        properties: user.posthog_properties
      )
    end

    def posthog_capture(event, properties = {}, user: Current.user)
      return unless user

      PostHog.capture(
        distinct_id: user.posthog_distinct_id,
        event: event,
        properties: properties.compact
      )
    end
end
