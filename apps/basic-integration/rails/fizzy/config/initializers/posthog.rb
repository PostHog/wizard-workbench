require "posthog"

api_key = ENV.fetch("POSTHOG_PROJECT_TOKEN", nil)
host = ENV.fetch("POSTHOG_HOST", nil)
missing_configuration = { "POSTHOG_PROJECT_TOKEN" => api_key, "POSTHOG_HOST" => host }.find { |_, value| value.blank? }

if missing_configuration
  if Rails.env.development?
    variable = missing_configuration.first
    raise KeyError,
      "#{variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{variable} is configured"
  end
else
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
end
