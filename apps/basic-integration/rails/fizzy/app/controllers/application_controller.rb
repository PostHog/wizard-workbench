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
    # Called by posthog-rails when automatic exception capture resolves user context.
    def current_user
      Current.user
    end

    # Authentication can precede account selection, so use the identity UUID at
    # the request boundary rather than an account-specific membership record.
    def identify_identity_with_posthog(identity = Current.identity)
      return unless identity

      PostHog.identify(
        distinct_id: identity.posthog_distinct_id,
        properties: identity.posthog_properties
      )
    end
end
