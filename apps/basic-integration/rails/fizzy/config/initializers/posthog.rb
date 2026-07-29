posthog_token = ENV["POSTHOG_PROJECT_TOKEN"]
posthog_host = ENV["POSTHOG_HOST"]

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
elsif Rails.env.production?
  Rails.logger.warn("PostHog disabled: POSTHOG_PROJECT_TOKEN and POSTHOG_HOST are not configured")
else
  missing = posthog_token ? "POSTHOG_HOST" : "POSTHOG_PROJECT_TOKEN"
  raise "#{missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing} is configured"
end
