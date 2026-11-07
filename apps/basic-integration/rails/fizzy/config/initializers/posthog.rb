# PostHog configuration and Rails auto-instrumentation.
require "posthog"

posthog_api_key = ENV["POSTHOG_PROJECT_TOKEN"].presence
posthog_host = ENV["POSTHOG_HOST"].presence

if posthog_api_key && posthog_host
  PostHog.init do |config|
    config.api_key = posthog_api_key
    config.host = posthog_host
  end

  PostHog::Rails.configure do |config|
    config.auto_capture_exceptions = true
    config.report_rescued_exceptions = true
    config.auto_instrument_active_job = true

    # Associate controller errors with the authenticated account user.
    config.capture_user_context = true
    config.current_user_method = :current_user
    config.user_id_method = :posthog_distinct_id
  end

  # Export only records emitted through this dedicated logger. Existing Rails
  # loggers and their outputs remain unchanged.
  begin
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

    Rails.configuration.x.posthog_logs_logger = posthog_log_provider.logger(name: "fizzy.posthog")

    at_exit do
      posthog_log_provider.shutdown
    rescue StandardError => error
      Rails.logger.warn("PostHog log exporter shutdown failed: #{error.message}")
    end
  rescue LoadError => error
    Rails.logger.warn("PostHog log capture is unavailable because OpenTelemetry dependencies are missing: #{error.message}") unless Rails.env.production?
  end
elsif !Rails.env.production?
  %w[ POSTHOG_PROJECT_TOKEN POSTHOG_HOST ].reject { |variable| ENV[variable].present? }.each do |missing_variable|
    Rails.logger.warn("#{missing_variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once #{missing_variable} is configured")
  end
end
