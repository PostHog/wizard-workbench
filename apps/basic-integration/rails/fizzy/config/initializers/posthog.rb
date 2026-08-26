token = ENV["POSTHOG_PROJECT_TOKEN"].presence
host = ENV["POSTHOG_HOST"].presence

if token.present? && host.present?
  PostHog.init do |config|
    config.api_key = token
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
elsif Rails.env.development?
  missing_variable = token.present? ? "POSTHOG_HOST" : "POSTHOG_PROJECT_TOKEN"
  raise "#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured"
end
