# PostHog configuration with Rails auto-instrumentation.
#
# In production, missing configuration leaves PostHog inactive so application
# boot is unaffected. Development raises instead, preventing missed events.
api_key = ENV["POSTHOG_API_KEY"]
host = ENV["POSTHOG_HOST"]

if api_key.present? && host.present?
  require "posthog"

  PostHog.init do |config|
    config.api_key = api_key
    config.host = host
  end

  PostHog::Rails.configure do |config|
    config.auto_capture_exceptions = true
    config.report_rescued_exceptions = true
    config.auto_instrument_active_job = true
    config.capture_user_context = true
    config.current_user_method = :current_user
    config.user_id_method = :posthog_distinct_id
  end
elsif Rails.env.development?
  missing_variable = api_key.present? ? "POSTHOG_HOST" : "POSTHOG_API_KEY"
  raise "#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured"
end
