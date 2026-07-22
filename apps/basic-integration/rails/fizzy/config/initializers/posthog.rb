project_token = ENV["POSTHOG_PROJECT_TOKEN"].presence
host = ENV["POSTHOG_HOST"].presence

if Rails.env.development?
  raise "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured" unless project_token
  raise "POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured" unless host
end

if project_token && host
  PostHog.init do |config|
    config.api_key = project_token
    config.host = host
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
