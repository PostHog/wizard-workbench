require "posthog"
require "opentelemetry/sdk"
require "opentelemetry/exporter/otlp"
require Rails.root.join("lib/posthog_logs")

posthog_environment_variables = %w[POSTHOG_PROJECT_TOKEN POSTHOG_HOST]
posthog_environment_variables.each do |variable|
  next if ENV[variable].present?

  if Rails.env.development?
    raise "#{variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{variable} is configured"
  end
end

if posthog_environment_variables.all? { |variable| ENV[variable].present? }
  PostHog.init do |config|
    config.api_key = ENV["POSTHOG_PROJECT_TOKEN"]
    config.host = ENV["POSTHOG_HOST"]
  end

  PostHog::Rails.configure do |config|
    config.auto_capture_exceptions = true
    config.report_rescued_exceptions = true
    config.auto_instrument_active_job = true
    config.capture_user_context = true
    config.current_user_method = :current_user
  end

  posthog_logs_endpoint = "#{ENV.fetch("POSTHOG_HOST").delete_suffix("/")}/i/v1/logs"
  posthog_logs_exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
    endpoint: posthog_logs_endpoint,
    headers: { "Authorization" => "Bearer #{ENV.fetch("POSTHOG_PROJECT_TOKEN")}" }
  )
  posthog_logs_provider = OpenTelemetry::SDK::Logs::LoggerProvider.new
  posthog_logs_provider.add_log_record_processor(
    OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(posthog_logs_exporter)
  )
  OpenTelemetry.logger_provider = posthog_logs_provider
  PostHogLogs.logger = posthog_logs_provider.logger(name: "fizzy.posthog")

  at_exit { posthog_logs_provider.shutdown }
end
