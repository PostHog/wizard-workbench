api_key = ENV["POSTHOG_API_KEY"]
host = ENV["POSTHOG_HOST"]

missing_variable = { "POSTHOG_API_KEY" => api_key, "POSTHOG_HOST" => host }.find { |_, value| value.blank? }&.first

if missing_variable
  if Rails.env.development?
    raise ArgumentError, "#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured"
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
    config.current_user_method = :posthog_current_identity
    config.user_id_method = :posthog_distinct_id
  end
end
