require "posthog"

api_key = ENV.fetch("POSTHOG_PROJECT_TOKEN", nil)
host = ENV.fetch("POSTHOG_HOST", nil)

if Rails.env.development?
  if api_key.blank?
    raise "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured"
  end
  if host.blank?
    raise "POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured"
  end
end

if api_key.present? && host.present?
  PostHog.init do |config|
    config.api_key = api_key
    config.host = host
  end

  PostHog::Rails.configure do |config|
    config.auto_capture_exceptions = true
    config.report_rescued_exceptions = true
    config.auto_instrument_active_job = true
    config.capture_user_context = true
    config.current_user_method = :current_identity
    config.user_id_method = :posthog_distinct_id
  end
end
