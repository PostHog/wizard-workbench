require "posthog"

posthog_project_token = ENV.fetch("POSTHOG_PROJECT_TOKEN", nil)
posthog_host = ENV.fetch("POSTHOG_HOST", nil)
Rails.configuration.x.posthog.enabled = posthog_project_token.present? && posthog_host.present?

if posthog_project_token.blank?
  if Rails.env.development?
    raise "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured"
  end
elsif posthog_host.blank?
  if Rails.env.development?
    raise "POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured"
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
    config.current_user_method = :current_identity
    config.user_id_method = :posthog_distinct_id
  end
end
