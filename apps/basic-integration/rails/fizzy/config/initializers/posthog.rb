posthog_token = ENV.fetch("POSTHOG_PROJECT_TOKEN", nil)
posthog_host = ENV.fetch("POSTHOG_HOST", nil)

if Rails.env.development?
  %w[POSTHOG_PROJECT_TOKEN POSTHOG_HOST].each do |variable|
    next if ENV[variable].present?

    raise "#{variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{variable} is configured"
  end
end

if posthog_token.present? && posthog_host.present?
  PostHog.init do |config|
    config.api_key = posthog_token
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
