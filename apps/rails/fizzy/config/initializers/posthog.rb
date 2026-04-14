# PostHog configuration with posthog-rails auto-instrumentation
#
# The posthog-rails gem provides:
# - Automatic exception capture for unhandled controller errors
# - ActiveJob instrumentation for background job failures
# - User context detection via current_posthog_user
# - Rails.error integration for rescued exceptions
PostHog.init do |config|
  config.api_key = ENV.fetch("POSTHOG_PROJECT_TOKEN", nil)
  config.host = ENV.fetch("POSTHOG_HOST", nil)
  config.on_error = proc { |status, msg| Rails.logger.error("PostHog error: #{msg}") }
end

PostHog::Rails.configure do |config|
  # Auto-capture unhandled exceptions in controllers
  config.auto_capture_exceptions = true

  # Also capture exceptions that Rails rescues (e.g. ActiveRecord::RecordNotFound)
  config.report_rescued_exceptions = true

  # Auto-instrument ActiveJob failures
  config.auto_instrument_active_job = true

  # Automatically associate errors with the current user via the helper defined in ApplicationController
  config.capture_user_context = true
  config.current_user_method = :current_posthog_user
  config.user_id_method = :posthog_distinct_id
end
