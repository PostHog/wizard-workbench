# PostHog Logs exports only messages emitted through PostHogLogs below. It deliberately
# does not attach to Rails.logger, so existing application logs remain local.
module PostHogLogs
  class << self
    attr_writer :logger

    def info(message, attributes = {})
      @logger&.on_emit(severity_text: "INFO", body: message, attributes: attributes)
    rescue StandardError => error
      Rails.logger.debug("PostHog Logs emission failed: #{error.class}") unless Rails.env.production?
    end
  end
end

begin
  require "opentelemetry/sdk"
  require "opentelemetry/exporter/otlp"
rescue LoadError => error
  unless Rails.env.production?
    Rails.logger.warn("PostHog Logs is disabled because OpenTelemetry dependencies are unavailable: #{error.path}")
  end
else
  project_token = ENV["POSTHOG_PROJECT_TOKEN"].to_s.strip
  host = ENV["POSTHOG_HOST"].to_s.strip

  if project_token.present? && host.present?
    begin
      exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
        endpoint: "#{host.delete_suffix("/")}/i/v1/logs",
        headers: { "Authorization" => "Bearer #{project_token}" }
      )
      processor = OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(exporter)
      provider = OpenTelemetry::SDK::Logs::LoggerProvider.new
      provider.add_log_record_processor(processor)

      PostHogLogs.logger = provider.logger(name: "fizzy.posthog")

      at_exit do
        provider.shutdown
      rescue StandardError => error
        Rails.logger.debug("PostHog Logs shutdown failed: #{error.class}") unless Rails.env.production?
      end
    rescue StandardError => error
      Rails.logger.warn("PostHog Logs is disabled: #{error.class}") unless Rails.env.production?
    end
  end
end
