require "posthog"

posthog_project_token = ENV["POSTHOG_PROJECT_TOKEN"]
posthog_host = ENV["POSTHOG_HOST"]
missing_posthog_setting = {
  "POSTHOG_PROJECT_TOKEN" => posthog_project_token,
  "POSTHOG_HOST" => posthog_host
}.find { |_, value| value.blank? }&.first

if missing_posthog_setting
  if Rails.env.development?
    raise KeyError,
      "#{missing_posthog_setting} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_posthog_setting} is configured"
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
