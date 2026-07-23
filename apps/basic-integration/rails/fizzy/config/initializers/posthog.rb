if ENV["POSTHOG_PROJECT_TOKEN"].present?
  PostHog.init do |config|
    config.api_key = ENV.fetch("POSTHOG_PROJECT_TOKEN")
    config.host = ENV.fetch("POSTHOG_HOST", "https://us.i.posthog.com")
  end

  PostHog::Rails.configure do |config|
    config.auto_capture_exceptions = true
    config.report_rescued_exceptions = true
    config.auto_instrument_active_job = true
    config.capture_user_context = true
    config.current_user_method = :current_user
    config.user_id_method = :posthog_distinct_id
  end
elsif Rails.env.development? || Rails.env.test?
  raise "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, " \
    "this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured"
end
