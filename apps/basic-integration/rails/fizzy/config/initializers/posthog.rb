# frozen_string_literal: true

posthog_api_key = ENV["POSTHOG_API_KEY"]
posthog_host = ENV["POSTHOG_HOST"]
missing_posthog_variable = {
  "POSTHOG_API_KEY" => posthog_api_key,
  "POSTHOG_HOST" => posthog_host
}.find { |_, value| value.blank? }&.first

Rails.configuration.x.posthog_enabled = missing_posthog_variable.nil?

if missing_posthog_variable
  if Rails.env.development?
    raise KeyError,
      "#{missing_posthog_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_posthog_variable} is configured"
  end
else
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
  end
end
