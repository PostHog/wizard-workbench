# frozen_string_literal: true

require "posthog"

# This logger is intentionally separate from Rails.logger so only log lines
# introduced by this integration are sent to PostHog.
module PostHogLogs
  class << self
    attr_accessor :logger

    def info(message, attributes = {})
      return unless logger

      logger.on_emit(severity_text: "INFO", body: message, attributes: attributes)
    rescue StandardError => error
      Rails.logger.warn("PostHog log export failed: #{error.class}")
    end
  end
end

posthog_api_key = ENV["POSTHOG_API_KEY"].presence
posthog_host = ENV["POSTHOG_HOST"].presence
missing_posthog_variables = {
  "POSTHOG_API_KEY" => posthog_api_key,
  "POSTHOG_HOST" => posthog_host
}.select { |_, value| value.blank? }.keys

if missing_posthog_variables.empty?
  PostHog.init do |config|
    config.api_key = posthog_api_key
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
    headers: { "Authorization" => "Bearer #{posthog_api_key}" }
  )
  posthog_log_provider.add_log_record_processor(
    OpenTelemetry::SDK::Logs::Export::BatchLogRecordProcessor.new(posthog_log_exporter)
  )

  PostHogLogs.logger = posthog_log_provider.logger(name: "fizzy.posthog")

  at_exit do
    posthog_log_provider.shutdown
  rescue StandardError => error
    Rails.logger.warn("PostHog log exporter shutdown failed: #{error.class}")
  end
elsif !Rails.env.production?
  missing_posthog_variables.each do |variable|
    Rails.logger.warn(
      "#{variable} variable required by PostHog is missing or un-configured, " \
      "this causes events to be silently missed. This error stops appearing once #{variable} is configured"
    )
  end
end
