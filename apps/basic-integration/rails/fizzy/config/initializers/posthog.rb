# PostHog configuration with Rails auto-instrumentation.
#
# This dedicated logger provider intentionally has no connection to Rails.logger:
# only log lines emitted through PostHogLogCapture leave the application.
module PostHogLogCapture
  class << self
    def configure(logger)
      @logger = logger
    end

    def info(message, attributes: {})
      @logger&.emit(severity_text: "INFO", body: message, attributes: attributes)
    end
  end
end

posthog_project_token = ENV["POSTHOG_PROJECT_TOKEN"]
posthog_host = ENV["POSTHOG_HOST"]
Rails.configuration.x.posthog_configured = posthog_project_token.present? && posthog_host.present?

if Rails.configuration.x.posthog_configured
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

  require "opentelemetry/sdk"
  require "opentelemetry/exporter/otlp"

  posthog_log_provider = OpenTelemetry::SDK::Logs::LoggerProvider.new
  posthog_log_exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
    endpoint: "#{posthog_host.chomp("/")}/i/v1/logs",
    headers: { "Authorization" => "Bearer #{posthog_project_token}" }
  )
  posthog_log_provider.add_log_record_processor(
    OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(posthog_log_exporter)
  )
  PostHogLogCapture.configure(posthog_log_provider.logger(name: "fizzy.posthog"))
elsif Rails.env.development?
  missing_variable = posthog_project_token.present? ? "POSTHOG_HOST" : "POSTHOG_PROJECT_TOKEN"
  raise "#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured"
end
