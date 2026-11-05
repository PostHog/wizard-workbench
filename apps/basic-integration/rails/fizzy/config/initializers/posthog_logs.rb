module PosthogLogs
  class << self
    def configure(api_key:, host:)
      require "uri"
      require "opentelemetry/sdk"
      require "opentelemetry/exporter/otlp"

      exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
        endpoint: URI.join(host, "/i/v1/logs").to_s,
        headers: { "Authorization" => "Bearer #{api_key}" }
      )
      @provider = OpenTelemetry::SDK::Logs::LoggerProvider.new(
        resource: OpenTelemetry::SDK::Resources::Resource.create(
          "service.name" => "fizzy",
          "deployment.environment" => Rails.env
        )
      )
      @provider.add_log_record_processor(
        OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(exporter)
      )
      @logger = @provider.logger("posthog.export")

      at_exit { @provider.shutdown }
    end

    def info(message, attributes: {})
      @logger&.on_emit(
        severity_text: "INFO",
        body: message,
        attributes: attributes
      )
    end
  end
end

posthog_api_key = ENV["POSTHOG_API_KEY"]
posthog_host = ENV["POSTHOG_HOST"]

PosthogLogs.configure(api_key: posthog_api_key, host: posthog_host) if posthog_api_key.present? && posthog_host.present?
