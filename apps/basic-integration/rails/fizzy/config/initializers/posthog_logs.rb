api_key = ENV["POSTHOG_API_KEY"]
host = ENV["POSTHOG_HOST"]

module PostHogLogs
  class << self
    def info(message, attributes = {})
      return unless @logger

      @logger.on_emit(
        severity_text: "INFO",
        body: message,
        attributes: attributes
      )
    end

    attr_writer :logger
  end
end

if api_key.present? && host.present?
  require "opentelemetry/sdk"
  require "opentelemetry/exporter/otlp"

  exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
    endpoint: "#{host.chomp("/")}/i/v1/logs",
    headers: { "Authorization" => "Bearer #{api_key}" }
  )
  provider = OpenTelemetry::SDK::Logs::LoggerProvider.new
  provider.add_log_record_processor(OpenTelemetry::SDK::Logs::BatchLogRecordProcessor.new(exporter))

  PostHogLogs.logger = provider.logger(name: "fizzy.posthog")
end
