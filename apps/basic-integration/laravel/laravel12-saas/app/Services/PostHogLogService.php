<?php

namespace App\Services;

use OpenTelemetry\API\Logs\LogRecord;
use OpenTelemetry\API\Logs\Severity;
use OpenTelemetry\Contrib\Otlp\LogsExporter;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\SDK\Logs\LoggerProvider;
use OpenTelemetry\SDK\Logs\SimpleLogRecordProcessor;
use RuntimeException;

class PostHogLogService
{
    private static mixed $logger = null;

    public function __construct()
    {
        if (config('posthog.disabled') || self::$logger) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey) {
            $this->handleMissingConfiguration('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (! $host) {
            $this->handleMissingConfiguration('POSTHOG_HOST');

            return;
        }

        $transport = (new OtlpHttpTransportFactory())->create(
            rtrim($host, '/').'/i/v1/logs',
            'application/x-protobuf',
            ['Authorization' => 'Bearer '.$apiKey],
        );

        $loggerProvider = new LoggerProvider(
            new SimpleLogRecordProcessor(new LogsExporter($transport)),
        );

        self::$logger = $loggerProvider->getLogger('posthog-laravel');
    }

    public function info(string $message, array $attributes = []): void
    {
        if (! $this->isEnabled() || ! self::$logger) {
            return;
        }

        self::$logger->emit(
            (new LogRecord($message))
                ->setSeverityNumber(Severity::INFO)
                ->setSeverityText('INFO')
                ->setAttributes($attributes),
        );
    }

    private function isEnabled(): bool
    {
        return ! config('posthog.disabled')
            && filled(config('posthog.api_key'))
            && filled(config('posthog.host'));
    }

    private function handleMissingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
