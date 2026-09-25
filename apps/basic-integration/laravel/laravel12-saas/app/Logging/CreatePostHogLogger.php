<?php

namespace App\Logging;

use Monolog\Handler\NullHandler;
use Monolog\Level;
use Monolog\Logger;
use OpenTelemetry\Contrib\Logs\Monolog\Handler as OpenTelemetryHandler;
use OpenTelemetry\Contrib\Otlp\LogsExporter;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\SDK\Logs\LoggerProvider;
use OpenTelemetry\SDK\Logs\SimpleLogRecordProcessor;
use RuntimeException;

class CreatePostHogLogger
{
    public function __invoke(array $config): Logger
    {
        $token = config('posthog.api_key');
        $host = config('posthog.host');

        if (config('posthog.disabled') || ! $token || ! $host) {
            if (! config('posthog.disabled') && config('app.debug')) {
                $variable = ! $token ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';

                throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
            }

            return new Logger('posthog', [new NullHandler()]);
        }

        $transport = (new OtlpHttpTransportFactory())->create(
            rtrim($host, '/').'/i/v1/logs',
            'application/x-protobuf',
            ['Authorization' => 'Bearer '.$token],
        );
        $loggerProvider = LoggerProvider::builder()
            ->addLogRecordProcessor(new SimpleLogRecordProcessor(new LogsExporter($transport)))
            ->build();

        return new Logger('posthog', [
            new OpenTelemetryHandler($loggerProvider, Level::Info),
        ]);
    }
}
