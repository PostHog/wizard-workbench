<?php

namespace App\Logging;

use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Level;
use Monolog\LogRecord;
use OpenTelemetry\Contrib\Otlp\LogsExporter;
use OpenTelemetry\SDK\Common\Export\Http\PsrTransportFactory;
use OpenTelemetry\SDK\Logs\LoggerProvider;
use OpenTelemetry\SDK\Logs\Processor\SimpleLogRecordProcessor;

class PostHogOtlpLogHandler extends AbstractProcessingHandler
{
    private readonly \OpenTelemetry\API\Logs\LoggerInterface $logger;

    public function __construct(string $apiKey, string $host)
    {
        parent::__construct(Level::Info, true);

        $endpoint = rtrim($host, '/').'/i/v1/logs';
        $transport = (new PsrTransportFactory())->create($endpoint, 'application/x-protobuf', [
            'Authorization' => 'Bearer '.$apiKey,
        ]);
        $exporter = new LogsExporter($transport);
        $provider = LoggerProvider::builder()
            ->addLogRecordProcessor(new SimpleLogRecordProcessor($exporter))
            ->build();

        $this->logger = $provider->getLogger('posthog.laravel');
    }

    protected function write(LogRecord $record): void
    {
        $this->logger->emit(
            $record->message,
            $record->level->value,
            $record->level->getName(),
            [
                'channel' => $record->channel,
                ...$record->context,
            ],
        );
    }
}
