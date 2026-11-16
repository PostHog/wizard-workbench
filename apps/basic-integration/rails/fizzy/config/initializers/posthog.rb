# PostHog configuration. The posthog-rails gem manages the shared client lifecycle,
# Rails exception reporting, and ActiveJob instrumentation.
PostHog::Rails.configure do |config|
  config.auto_capture_exceptions = true
  config.report_rescued_exceptions = true
  config.auto_instrument_active_job = true

  # Associate controller errors with the request's authenticated identity.
  config.capture_user_context = true
  config.current_user_method = :current_identity
  config.user_id_method = :posthog_distinct_id
end

project_token = ENV["POSTHOG_PROJECT_TOKEN"].to_s.strip
host = ENV["POSTHOG_HOST"].to_s.strip
missing_variables = []
missing_variables << "POSTHOG_PROJECT_TOKEN" if project_token.empty?
missing_variables << "POSTHOG_HOST" if host.empty?

if missing_variables.any?
  unless Rails.env.production?
    missing_variables.each do |variable|
      Rails.logger.warn("#{variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{variable} is configured")
    end
  end
else
  PostHog.init do |config|
    config.api_key = project_token
    config.host = host
    config.test_mode = true if Rails.env.test?
  end
end
