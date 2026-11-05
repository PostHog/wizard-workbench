<?php

namespace App\Services;

use OpenTelemetry\API\Logs\LogRecord;
use OpenTelemetry\Contrib\Otlp\LogsExporter;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\SDK\Logs\LoggerProvider;
use OpenTelemetry\SDK\Logs\SimpleLogRecordProcessor;
use RuntimeException;

class PostHogLogService
{
    private mixed $logger = null;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $this->isConfigured($apiKey, 'POSTHOG_PROJECT_TOKEN') || ! $this->isConfigured($host, 'POSTHOG_HOST')) {
            return;
        }

        $transport = (new OtlpHttpTransportFactory())->create(
            rtrim($host, '/').'/i/v1/logs',
            'application/x-protobuf',
            ['Authorization' => 'Bearer '.$apiKey],
        );

        $provider = LoggerProvider::builder()
            ->addLogRecordProcessor(new SimpleLogRecordProcessor(new LogsExporter($transport)))
            ->build();

        $this->logger = $provider->getLogger('posthog-laravel');
    }

    /**
     * Emit an integration-owned structured log line through the dedicated PostHog exporter.
     *
     * @param array<string, scalar|null> $attributes
     */
    public function info(string $message, array $attributes = []): void
    {
        if ($this->logger === null) {
            return;
        }

        $this->logger->emit((new LogRecord($message))->setAttributes($attributes));
    }

    private function isConfigured(mixed $value, string $variable): bool
    {
        if (is_string($value) && trim($value) !== '') {
            return true;
        }

        if (config('app.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }

        return false;
    }
}
