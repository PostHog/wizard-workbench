<?php

namespace App\Services;

use OpenTelemetry\API\Logs\LogRecord;
use OpenTelemetry\API\Logs\Severity;
use OpenTelemetry\Contrib\Otlp\LogsExporter;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\SDK\Logs\LoggerProvider;
use OpenTelemetry\SDK\Logs\Processor\SimpleLogRecordProcessor;
use RuntimeException;

class PostHogLogService
{
    private bool $enabled;

    private ?\OpenTelemetry\API\Logs\LoggerInterface $logger = null;

    public function __construct()
    {
        $this->enabled = ! config('posthog.disabled');

        if (! $this->enabled) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey || ! $host) {
            $this->enabled = false;

            if (config('app.debug')) {
                $variable = ! $apiKey ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';

                throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
            }

            return;
        }

        $transport = (new OtlpHttpTransportFactory())->create(
            rtrim($host, '/').'/i/v1/logs',
            'application/x-protobuf',
            ['Authorization' => "Bearer {$apiKey}"],
        );

        $provider = LoggerProvider::builder()
            ->addLogRecordProcessor(new SimpleLogRecordProcessor(new LogsExporter($transport)))
            ->build();

        $this->logger = $provider->getLogger('posthog-dedicated-app-logs');
    }

    public function info(string $message, array $attributes = []): void
    {
        if (! $this->enabled || ! $this->logger) {
            return;
        }

        $record = (new LogRecord($message, Severity::INFO))
            ->setAttributes($attributes);

        $this->logger->emit($record);
    }
}
