require "posthog"

project_token = ENV["POSTHOG_PROJECT_TOKEN"]
host = ENV["POSTHOG_HOST"]
Rails.configuration.x.posthog_enabled = project_token.present? && host.present?

missing_variable = if project_token.blank?
  "POSTHOG_PROJECT_TOKEN"
elsif host.blank?
  "POSTHOG_HOST"
end

if missing_variable
  message = "#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured"
  raise KeyError, message if Rails.env.development?
else
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
end
