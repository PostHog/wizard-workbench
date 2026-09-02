# PostHog configuration and Rails auto-instrumentation.
posthog_project_token = ENV["POSTHOG_PROJECT_TOKEN"].presence
posthog_host = ENV["POSTHOG_HOST"].presence

if posthog_project_token.blank? || posthog_host.blank?
  if Rails.env.development?
    missing_variable = posthog_project_token.blank? ? "POSTHOG_PROJECT_TOKEN" : "POSTHOG_HOST"
    raise KeyError,
      "#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured"
  end
else
  PostHog.init do |config|
    config.api_key = posthog_project_token
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
end
