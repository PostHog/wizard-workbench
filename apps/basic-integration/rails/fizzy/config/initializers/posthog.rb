posthog_api_key = ENV["POSTHOG_API_KEY"]
posthog_host = ENV["POSTHOG_HOST"]
posthog_enabled = posthog_api_key.present? && posthog_host.present?
Rails.configuration.x.posthog_enabled = posthog_enabled

if posthog_enabled
  PostHog.init do |config|
    config.api_key = posthog_api_key
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
elsif Rails.env.development?
  missing_variable = posthog_api_key.present? ? "POSTHOG_HOST" : "POSTHOG_API_KEY"
  raise "#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured"
end
