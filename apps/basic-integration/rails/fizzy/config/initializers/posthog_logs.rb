# PostHog Logs is intentionally isolated from Rails.logger so this exporter only
# sends the purpose-built records emitted through PostHogLogs below.
module PostHogLogs
  class << self
    def info(message, attributes = {})
      @logger&.emit(severity_text: "INFO", body: message, attributes: attributes)
    rescue StandardError => error
      Rails.logger.warn("PostHog Logs could not emit a record: #{error.class}")
    end

    def shutdown
      @provider&.shutdown
    rescue StandardError => error
      Rails.logger.warn("PostHog Logs could not shut down cleanly: #{error.class}")
    end

    private
      attr_writer :logger, :provider
  end
end

project_token = ENV["POSTHOG_PROJECT_TOKEN"].to_s.strip
posthog_host = ENV["POSTHOG_HOST"].to_s.strip
missing_variable = "POSTHOG_PROJECT_TOKEN" if project_token.empty?
missing_variable ||= "POSTHOG_HOST" if posthog_host.empty?

if missing_variable
  unless Rails.env.production?
    Rails.logger.warn(
      "#{missing_variable} variable required by PostHog is missing or un-configured, " \
      "this causes events to be silently missed. This error stops appearing once " \
      "#{missing_variable} is configured"
    )
  end
else
  begin
    require "opentelemetry/sdk"
    require "opentelemetry/exporter/otlp"

    exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
      endpoint: "#{posthog_host}/i/v1/logs",
      headers: { "Authorization" => "Bearer #{project_token}" }
    )
    processor = OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(exporter)
    provider = OpenTelemetry::SDK::Logs::LoggerProvider.new
    provider.add_log_record_processor(processor)

    PostHogLogs.send(:provider=, provider)
    PostHogLogs.send(:logger=, provider.logger(name: "fizzy.posthog"))

    # Export happens in the processor background worker; shutdown is the only flush.
    at_exit { PostHogLogs.shutdown }
  rescue LoadError, StandardError => error
    Rails.logger.warn("PostHog Logs is disabled until compatible OpenTelemetry dependencies are installed: #{error.message}") unless Rails.env.production?
  end
end
