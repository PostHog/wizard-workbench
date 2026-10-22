# frozen_string_literal: true

# This logger is intentionally separate from Rails.logger so only log records
# introduced for PostHog leave the application through this exporter.
module PostHogLogs
  class << self
    def info(*)
    end
  end
end

posthog_logs_api_key = ENV["POSTHOG_API_KEY"]
posthog_logs_host = ENV["POSTHOG_HOST"]

if posthog_logs_api_key.present? && posthog_logs_host.present?
  require "opentelemetry/sdk"
  require "opentelemetry/exporter/otlp"

  posthog_logs_exporter = OpenTelemetry::Exporter::OTLP::Logs::LogsExporter.new(
    endpoint: "#{posthog_logs_host.chomp("/")}/i/v1/logs",
    headers: { "Authorization" => "Bearer #{posthog_logs_api_key}" }
  )
  posthog_logs_provider = OpenTelemetry::SDK::Logs::LoggerProvider.new(
    resource: OpenTelemetry::SDK::Resources::Resource.create(
      "service.name" => "fizzy",
      "deployment.environment.name" => Rails.env
    )
  )
  posthog_logs_provider.add_log_record_processor(
    OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(posthog_logs_exporter)
  )
  OpenTelemetry.logger_provider = posthog_logs_provider

  PostHogLogs.singleton_class.class_eval do
    define_method(:info) do |message, attributes = {}|
      @logger ||= OpenTelemetry.logger_provider.logger(name: "fizzy.posthog_logs")
      @logger.emit(severity_text: "INFO", body: message, attributes: attributes)
    end
  end
end
