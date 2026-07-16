# PostHog configuration for product analytics and automatic Rails instrumentation.
PostHog.init do |config|
  config.api_key = ENV.fetch("POSTHOG_API_KEY")
  config.host = ENV.fetch("POSTHOG_HOST")
  config.test_mode = true if Rails.env.test?
end

PostHog::Rails.configure do |config|
  config.auto_capture_exceptions = true
  config.report_rescued_exceptions = true
  config.auto_instrument_active_job = true
  config.capture_user_context = true
  config.current_user_method = :current_user
  config.user_id_method = :posthog_distinct_id
end
