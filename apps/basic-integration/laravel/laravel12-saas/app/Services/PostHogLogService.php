<?php

namespace App\Services;

use LogicException;
use Monolog\Level;
use Monolog\Logger;
use OpenTelemetry\Contrib\Logs\Monolog\Handler;
use OpenTelemetry\Contrib\Otlp\LogsExporter;
use OpenTelemetry\Contrib\Otlp\TransportFactory;
use OpenTelemetry\SDK\Logs\LoggerProvider;
use OpenTelemetry\SDK\Logs\Processor\SimpleLogRecordProcessor;

class PostHogLogService
{
    private ?Logger $logger = null;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey) {
            $this->throwMissingConfiguration('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (! $host) {
            $this->throwMissingConfiguration('POSTHOG_HOST');

            return;
        }

        $transport = (new TransportFactory())->create(
            rtrim($host, '/').'/i/v1/logs',
            'application/x-protobuf',
            ['Authorization' => 'Bearer '.$apiKey],
        );

        $loggerProvider = LoggerProvider::builder()
            ->addLogRecordProcessor(new SimpleLogRecordProcessor(new LogsExporter($transport)))
            ->build();

        $this->logger = new Logger('posthog-instrumentation');
        $this->logger->pushHandler(new Handler($loggerProvider, Level::Info));
    }

    /**
     * Export a purpose-written instrumentation log line without touching Laravel's log channels.
     */
    public function info(string $message, array $context = []): void
    {
        $this->logger?->info($message, $context);
    }

    private function throwMissingConfiguration(string $variable): void
    {
        if (config('posthog.debug')) {
            throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
