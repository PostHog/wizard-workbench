# PostHog is initialized once here; posthog-rails manages its lifecycle and
# exposes the shared PostHog facade to controllers, jobs, and other call sites.
PostHog::Rails.configure do |config|
  config.auto_capture_exceptions = true
  config.report_rescued_exceptions = true
  config.auto_instrument_active_job = true
  config.capture_user_context = true
  config.current_user_method = :posthog_current_user
  config.user_id_method = :posthog_distinct_id
end

project_token = ENV["POSTHOG_PROJECT_TOKEN"].to_s.strip
posthog_host = ENV["POSTHOG_HOST"].to_s.strip

if project_token.empty? || posthog_host.empty?
  unless Rails.env.production?
    missing_variable = project_token.empty? ? "POSTHOG_PROJECT_TOKEN" : "POSTHOG_HOST"
    Rails.logger.warn(
      "#{missing_variable} variable required by PostHog is missing or un-configured, " \
      "this causes events to be silently missed. This error stops appearing once " \
      "#{missing_variable} is configured"
    )
  end
else
  PostHog.init do |config|
    config.api_key = project_token
    config.host = posthog_host
    config.test_mode = true if Rails.env.test?
  end
end
