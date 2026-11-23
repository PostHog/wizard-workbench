# Export only log records explicitly emitted through PostHogLogs. Rails' existing
# loggers keep their current destinations and are intentionally not attached here.
module PostHogLogs
  class << self
    def info(body, attributes: {})
      @logger&.emit(
        severity_number: :info,
        severity_text: "INFO",
        body: body,
        attributes: attributes
      )
    rescue StandardError => error
      Rails.logger.warn("PostHog log emission failed: #{error.class}")
    end

    def configure(project_token:, host:)
      require "opentelemetry/sdk"
      require "opentelemetry/exporter/otlp"

      endpoint = "#{host.delete_suffix("/")}/i/v1/logs"
      exporter = OpenTelemetry::Exporter::OTLP::Logs::Exporter.new(
        endpoint: endpoint,
        headers: { "Authorization" => "Bearer #{project_token}" }
      )
      @provider = OpenTelemetry::SDK::Logs::LoggerProvider.new
      @provider.add_log_record_processor(
        OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(exporter)
      )
      @logger = @provider.logger(name: "fizzy.posthog")
    rescue LoadError => error
      Rails.logger.warn("PostHog log export is unavailable: #{error.message}")
    rescue StandardError => error
      Rails.logger.warn("PostHog log export configuration failed: #{error.class}")
    end

    def shutdown
      @provider&.shutdown(timeout: 1)
    rescue StandardError => error
      Rails.logger.warn("PostHog log export shutdown failed: #{error.class}")
    end
  end
end

project_token = ENV["POSTHOG_PROJECT_TOKEN"].to_s.strip
host = ENV["POSTHOG_HOST"].to_s.strip

if project_token.present? && host.present?
  PostHogLogs.configure(project_token: project_token, host: host)
  at_exit { PostHogLogs.shutdown }
end
