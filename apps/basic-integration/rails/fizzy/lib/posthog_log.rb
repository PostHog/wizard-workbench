class PostHogLog
  class << self
    def configure(endpoint:, authorization:)
      exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
        endpoint: endpoint,
        headers: { "Authorization" => authorization }
      )
      processor = OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(exporter)
      provider = OpenTelemetry::SDK::Logs::LoggerProvider.new
      provider.add_log_record_processor(processor)

      @processor = processor
      @logger = provider.logger(name: "fizzy.posthog")
      at_exit { @processor&.shutdown }
    end

    def info(message, attributes: {})
      @logger&.on_emit(
        body: message,
        severity_number: OpenTelemetry::Logs::SeverityNumber::INFO,
        severity_text: "INFO",
        attributes: attributes
      )
    end
  end
end
