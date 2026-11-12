<?php

namespace App\Logging;

use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Level;
use Monolog\LogRecord as MonologLogRecord;
use OpenTelemetry\API\Logs\LogRecord;
use OpenTelemetry\API\Logs\LoggerInterface;
use OpenTelemetry\API\Logs\Severity;
use OpenTelemetry\Contrib\Otlp\LogsExporter;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\SDK\Logs\LoggerProvider;
use OpenTelemetry\SDK\Logs\Processor\BatchLogRecordProcessor;
use Throwable;

/**
 * Exports only records sent to Laravel's dedicated "posthog" log channel.
 */
class PostHogLogHandler extends AbstractProcessingHandler
{
    private ?LoggerInterface $logger = null;

    private bool $missingConfigurationWarningLogged = false;

    public function __construct(Level $level = Level::Info, bool $bubble = true)
    {
        parent::__construct($level, $bubble);

        if (! config('posthog.enabled') || ! $this->isConfigured()) {
            return;
        }

        $transport = (new OtlpHttpTransportFactory())->create(
            rtrim((string) config('posthog.host'), '/').'/i/v1/logs',
            'application/x-protobuf',
            ['Authorization' => 'Bearer '.config('posthog.api_key')],
        );
        $provider = LoggerProvider::builder()
            ->addLogRecordProcessor(new BatchLogRecordProcessor(new LogsExporter($transport)))
            ->build();

        $this->logger = $provider->getLogger('laravel-posthog');

        register_shutdown_function(static function () use ($provider): void {
            try {
                $provider->shutdown();
            } catch (Throwable) {
                // Log delivery must not affect application shutdown.
            }
        });
    }

    protected function write(MonologLogRecord $record): void
    {
        if ($this->logger === null) {
            $this->warnAboutMissingConfiguration();

            return;
        }

        try {
            $this->logger->emit(
                (new LogRecord($record->message))
                    ->setSeverityNumber($this->severityFor($record->level))
                    ->setSeverityText($record->level->getName())
                    ->setAttributes($this->scalarAttributes($record->context)),
            );
        } catch (Throwable) {
            // Log delivery must not interrupt the application request.
        }
    }

    private function severityFor(Level $level): Severity
    {
        return match ($level) {
            Level::Emergency, Level::Alert, Level::Critical, Level::Error => Severity::ERROR,
            Level::Warning => Severity::WARN,
            Level::Notice, Level::Info => Severity::INFO,
            Level::Debug => Severity::DEBUG,
        };
    }

    private function isConfigured(): bool
    {
        return filled(config('posthog.api_key')) && filled(config('posthog.host'));
    }

    private function warnAboutMissingConfiguration(): void
    {
        if ($this->missingConfigurationWarningLogged || app()->environment('production')) {
            return;
        }

        $this->missingConfigurationWarningLogged = true;
        $missing = ! filled(config('posthog.api_key')) ? 'POSTHOG_API_KEY' : 'POSTHOG_HOST';

        error_log("{$missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$missing} is configured");
    }

    /**
     * @param  array<string, mixed>  $context
     * @return array<string, bool|float|int|string|null>
     */
    private function scalarAttributes(array $context): array
    {
        return array_filter($context, static fn (mixed $value): bool => is_bool($value) || is_float($value) || is_int($value) || is_string($value) || $value === null);
    }
}
