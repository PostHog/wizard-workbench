# PostHog configuration with Rails auto-instrumentation.
# Missing configuration is a production no-op, but fails loudly elsewhere so
# events are not silently missed during development or testing.
require "posthog"
require "posthog/rails"

posthog_token = ENV["POSTHOG_PROJECT_TOKEN"]
posthog_host = ENV["POSTHOG_HOST"]

if posthog_token && !posthog_token.empty? && posthog_host && !posthog_host.empty?
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
elsif !Rails.env.production?
  missing_variable = posthog_token.to_s.empty? ? "POSTHOG_PROJECT_TOKEN" : "POSTHOG_HOST"
  raise "#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured"
end
