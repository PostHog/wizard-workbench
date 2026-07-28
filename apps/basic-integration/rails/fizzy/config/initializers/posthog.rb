# PostHog configuration with posthog-rails auto-instrumentation.
# The SDK remains disabled when the token is not configured in production.
posthog_project_token = ENV["POSTHOG_PROJECT_TOKEN"]

if posthog_project_token
  PostHog.init do |config|
    config.api_key = posthog_project_token
    config.host = ENV["POSTHOG_HOST"] if ENV["POSTHOG_HOST"].present?
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
  raise "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured"
end
