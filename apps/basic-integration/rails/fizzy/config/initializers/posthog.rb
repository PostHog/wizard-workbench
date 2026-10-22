require "posthog"

posthog_api_key = ENV["POSTHOG_PROJECT_TOKEN"]
posthog_host = ENV["POSTHOG_HOST"]

if posthog_api_key.present? && posthog_host.present?
  require "opentelemetry/sdk"
  require "opentelemetry/exporter/otlp"

  posthog_logs_exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
    endpoint: "#{posthog_host.chomp("/")}/i/v1/logs",
    headers: { "Authorization" => "Bearer #{posthog_api_key}" }
  )
  posthog_logs_provider = OpenTelemetry::SDK::Logs::LoggerProvider.new
  posthog_logs_provider.add_log_record_processor(
    OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(posthog_logs_exporter)
  )
  POSTHOG_LOG_CAPTURE_LOGGER = posthog_logs_provider.logger(name: "posthog-log-capture")

  PostHog.init do |config|
    config.api_key = posthog_api_key
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
elsif Rails.env.development? || ENV["POSTHOG_DEBUG"] == "true"
  missing_variable = posthog_api_key.present? ? "POSTHOG_HOST" : "POSTHOG_PROJECT_TOKEN"
  raise "#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured"
end
