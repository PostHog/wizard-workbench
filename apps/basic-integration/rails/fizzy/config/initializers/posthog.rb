# frozen_string_literal: true

posthog_config = {
  "POSTHOG_PROJECT_TOKEN" => ENV["POSTHOG_PROJECT_TOKEN"],
  "POSTHOG_HOST" => ENV["POSTHOG_HOST"]
}
missing_posthog_config = posthog_config.select { |_, value| value.blank? }.keys

if missing_posthog_config.any?
  unless Rails.env.production?
    missing_posthog_config.each do |key|
      Rails.logger.warn("#{key} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{key} is configured")
    end
  end
else
  PostHog.init do |config|
    config.api_key = posthog_config.fetch("POSTHOG_PROJECT_TOKEN")
    config.host = posthog_config.fetch("POSTHOG_HOST")
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
