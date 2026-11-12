# PostHog is initialized once here; posthog-rails supplies the shared PostHog facade,
# request context, exception capture, ActiveJob instrumentation, and shutdown handling.
PostHog::Rails.configure do |config|
  config.auto_capture_exceptions = true
  config.report_rescued_exceptions = true
  config.auto_instrument_active_job = true

  # Associate controller exceptions with the authenticated identity for this request.
  config.capture_user_context = true
  config.current_user_method = :current_identity
  config.user_id_method = :posthog_distinct_id
end

project_token = ENV["POSTHOG_PROJECT_TOKEN"].to_s.strip
host = ENV["POSTHOG_HOST"].to_s.strip

if project_token.empty? || host.empty?
  missing_variable = project_token.empty? ? "POSTHOG_PROJECT_TOKEN" : "POSTHOG_HOST"

  unless Rails.env.production?
    Rails.logger.warn(
      "#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured"
    )
  end
else
  PostHog.init do |config|
    config.api_key = project_token
    config.host = host
    config.test_mode = true if Rails.env.test?
  end
end
