require "posthog"

posthog_token = ENV["POSTHOG_PROJECT_TOKEN"].presence
posthog_host = ENV["POSTHOG_HOST"].presence

if posthog_token && posthog_host
  PostHog.init do |config|
    config.api_key = posthog_token
    config.host = posthog_host
  end

  PostHog::Rails.configure do |config|
    config.auto_capture_exceptions = true
    config.report_rescued_exceptions = true
    config.auto_instrument_active_job = true
    config.capture_user_context = true
    config.current_user_method = :current_user
    config.user_id_method = :posthog_distinct_id
  end
elsif Rails.env.development? || Rails.env.test?
  missing_key = posthog_token ? "POSTHOG_HOST" : "POSTHOG_PROJECT_TOKEN"
  raise "#{missing_key} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_key} is configured"
end
