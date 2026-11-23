# PostHog uses one shared client managed by the posthog-rails integration.
# Its Railtie handles request context, exception capture, ActiveJob instrumentation,
# and graceful shutdown.
PostHog::Rails.configure do |config|
  config.auto_capture_exceptions = true
  config.report_rescued_exceptions = true
  config.auto_instrument_active_job = true

  # Associate automatic controller error reports with the authenticated user.
  config.capture_user_context = true
  config.current_user_method = :posthog_current_user
  config.user_id_method = :posthog_distinct_id
end

project_token = ENV["POSTHOG_PROJECT_TOKEN"].to_s.strip
posthog_host = ENV["POSTHOG_HOST"].to_s.strip
missing_variable = "POSTHOG_PROJECT_TOKEN" if project_token.empty?
missing_variable ||= "POSTHOG_HOST" if posthog_host.empty?

if missing_variable
  unless Rails.env.production?
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
