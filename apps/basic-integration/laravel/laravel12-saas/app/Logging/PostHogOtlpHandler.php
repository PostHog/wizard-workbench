<?php

namespace App\Logging;

use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Level;
use Monolog\LogRecord;
use OpenTelemetry\API\Logs\Severity;
use OpenTelemetry\Contrib\Otlp\Logs\Exporter as OtlpLogExporter;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\SDK\Logs\BatchLogRecordProcessor;
use OpenTelemetry\SDK\Logs\LoggerProvider;

/**
 * Exports only records written to Laravel's dedicated "posthog" channel.
 */
class PostHogOtlpHandler extends AbstractProcessingHandler
{
    private $logger = null;

    private $loggerProvider = null;

    public function __construct(Level|string|int $level = Level::Info, bool $bubble = true)
    {
        parent::__construct($level, $bubble);

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! config('posthog.enabled') || blank($apiKey) || blank($host)) {
            return;
        }

        $transport = (new OtlpHttpTransportFactory())->create(
            rtrim($host, '/').'/i/v1/logs',
            'application/x-protobuf',
            ['Authorization' => 'Bearer '.$apiKey],
        );
        $exporter = new OtlpLogExporter($transport);

        $this->loggerProvider = LoggerProvider::builder()
            ->addLogRecordProcessor(new BatchLogRecordProcessor($exporter))
            ->build();
        $this->logger = $this->loggerProvider->getLogger('posthog-laravel');
    }

    protected function write(LogRecord $record): void
    {
        if ($this->logger === null) {
            return;
        }

        try {
            $this->logger->emit(
                $record->message,
                $this->severityFor($record->level),
                $record->level->getName(),
                $record->context,
            );
        } catch (\Throwable) {
            // Log delivery must never interrupt the application's own work.
        }
    }

    public function close(): void
    {
        try {
            $this->loggerProvider?->shutdown();
        } catch (\Throwable) {
            // Log delivery must never interrupt application shutdown.
        }

        parent::close();
    }

    private function severityFor(Level $level): Severity
    {
        return match (true) {
            $level->value >= Level::Error->value => Severity::Error,
            $level->value >= Level::Warning->value => Severity::Warn,
            $level->value >= Level::Info->value => Severity::Info,
            default => Severity::Debug,
        };
    }
}
