# This provider is deliberately isolated from Rails.logger so that only log records
# added by this integration are exported to PostHog.
require "uri"
require "opentelemetry/sdk"
require "opentelemetry/sdk/logs"
require "opentelemetry/exporter/otlp"
require "opentelemetry/exporter/otlp/logs_exporter"

module PostHogLogs
  class << self
    attr_writer :logger

    def info(message, attributes = {})
      @logger&.emit(severity_text: "INFO", body: message, attributes: attributes)
    rescue StandardError => error
      Rails.logger.warn("PostHog log emission failed: #{error.class}")
    end
  end
end

project_token = ENV["POSTHOG_PROJECT_TOKEN"].to_s.strip
posthog_host = ENV["POSTHOG_HOST"].to_s.strip

unless project_token.empty? || posthog_host.empty?
  resource = OpenTelemetry::SDK::Resources::Resource.create(
    "service.name" => "fizzy",
    "deployment.environment" => Rails.env
  )
  logger_provider = OpenTelemetry::SDK::Logs::LoggerProvider.new(resource: resource)
  exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
    endpoint: URI.join(posthog_host, "/i/v1/logs").to_s,
    headers: { "Authorization" => "Bearer #{project_token}" }
  )

  logger_provider.add_log_record_processor(
    OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(exporter)
  )
  PostHogLogs.logger = logger_provider.logger("posthog.logs")

  at_exit do
    logger_provider.shutdown
  rescue StandardError => error
    Rails.logger.warn("PostHog log shutdown failed: #{error.class}")
  end
end
