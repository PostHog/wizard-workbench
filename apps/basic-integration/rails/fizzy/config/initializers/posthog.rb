project_token = ENV["POSTHOG_PROJECT_TOKEN"].presence
host = ENV["POSTHOG_HOST"].presence
posthog_enabled = project_token && host

Rails.application.config.x.posthog.enabled = posthog_enabled.present?

if posthog_enabled
  PostHog.init do |config|
    config.api_key = project_token
    config.host = host
  end

  PostHog::Rails.configure do |config|
    config.auto_capture_exceptions = true
    config.report_rescued_exceptions = true
    config.auto_instrument_active_job = true
    config.capture_user_context = true
    config.current_user_method = :posthog_current_user
    config.user_id_method = :posthog_distinct_id
  end
elsif Rails.env.development?
  missing_variable = project_token ? "POSTHOG_HOST" : "POSTHOG_PROJECT_TOKEN"
  raise "#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured"
end
