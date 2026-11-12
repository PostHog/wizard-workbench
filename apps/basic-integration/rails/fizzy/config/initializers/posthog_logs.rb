# Export only the purpose-written lines emitted through PostHogLogs. This deliberately
# does not attach an exporter to Rails.logger, so existing application logs stay local.
module PostHogLogs
  class << self
    def configure(logger)
      @logger = logger
    end

    def info(message, attributes = {})
      return unless @logger

      @logger.on_emit(severity_text: "INFO", body: message, attributes: attributes)
    rescue StandardError => error
      Rails.logger.debug("PostHog log export failed: #{error.class}") unless Rails.env.production?
    end
  end
end

project_token = ENV["POSTHOG_PROJECT_TOKEN"].to_s.strip
host = ENV["POSTHOG_HOST"].to_s.strip

if project_token.present? && host.present?
  begin
    require "opentelemetry/sdk"
    require "opentelemetry/exporter/otlp"

    exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
      endpoint: "#{host.delete_suffix("/")}/i/v1/logs",
      headers: { "Authorization" => "Bearer #{project_token}" }
    )
    provider = OpenTelemetry::SDK::Logs::LoggerProvider.new
    provider.add_log_record_processor(
      OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(exporter)
    )

    PostHogLogs.configure(provider.logger(name: "fizzy.posthog"))

    at_exit do
      provider.shutdown(timeout: 3)
    rescue StandardError => error
      Rails.logger.debug("PostHog log shutdown failed: #{error.class}") unless Rails.env.production?
    end
  rescue LoadError => error
    Rails.logger.warn("PostHog log export is disabled because #{error.path} is not installed") unless Rails.env.production?
  rescue StandardError => error
    Rails.logger.warn("PostHog log export is disabled because setup failed: #{error.class}") unless Rails.env.production?
  end
end
