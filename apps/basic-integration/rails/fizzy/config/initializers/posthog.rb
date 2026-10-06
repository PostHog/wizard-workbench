require "posthog"

posthog_project_token = ENV["POSTHOG_PROJECT_TOKEN"].presence
posthog_host = ENV["POSTHOG_HOST"].presence
missing_configuration = {
  "POSTHOG_PROJECT_TOKEN" => posthog_project_token,
  "POSTHOG_HOST" => posthog_host
}.find { |_, value| value.blank? }&.first

if missing_configuration
  if Rails.env.development?
    raise "#{missing_configuration} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_configuration} is configured"
  end
else
  require "opentelemetry/sdk"
  require "opentelemetry/exporter/otlp"

  posthog_log_exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
    endpoint: "#{posthog_host.chomp("/")}/i/v1/logs",
    headers: { "Authorization" => "Bearer #{posthog_project_token}" }
  )
  posthog_log_provider = OpenTelemetry::SDK::Logs::LoggerProvider.new
  posthog_log_provider.add_log_record_processor(
    OpenTelemetry::SDK::Logs::Export::SimpleLogRecordProcessor.new(posthog_log_exporter)
  )

  Rails.application.config.x.posthog_logger = posthog_log_provider.logger(name: "posthog")

  PostHog.init do |config|
    config.api_key = posthog_project_token
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
end
