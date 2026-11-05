# PostHog configuration with Rails auto-instrumentation.
require "posthog"

# The SDK is initialized once here. Call sites use PostHog.capture and
# PostHog.identify class methods rather than constructing their own client.
posthog_api_key = ENV["POSTHOG_PROJECT_TOKEN"].presence
posthog_host = ENV["POSTHOG_HOST"].presence
Rails.configuration.x.posthog_configured = false

if posthog_api_key.blank?
  if Rails.env.development?
    raise "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured"
  end
elsif posthog_host.blank?
  if Rails.env.development?
    raise "POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured"
  end
else
  PostHog.init do |config|
    config.api_key = posthog_api_key
    config.host = posthog_host
  end
  Rails.configuration.x.posthog_configured = true

  # This provider is deliberately isolated from Rails.logger so only the
  # purpose-written lifecycle lines below are exported to PostHog Logs.
  require "opentelemetry/sdk"
  require "opentelemetry/exporter/otlp"

  posthog_logs_exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
    endpoint: URI.join(posthog_host, "/i/v1/logs").to_s,
    headers: { "Authorization" => "Bearer #{posthog_api_key}" }
  )
  posthog_logs_provider = OpenTelemetry::SDK::Logs::LoggerProvider.new
  posthog_logs_provider.add_log_record_processor(
    OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(posthog_logs_exporter)
  )
  Rails.configuration.x.posthog_log_logger = posthog_logs_provider.logger("fizzy.posthog")

  at_exit { posthog_logs_provider.shutdown }

  PostHog::Rails.configure do |config|
    config.auto_capture_exceptions = true
    config.report_rescued_exceptions = true
    config.auto_instrument_active_job = true
    config.capture_user_context = true
    config.current_user_method = :posthog_current_user
    config.user_id_method = :posthog_distinct_id
  end
end
