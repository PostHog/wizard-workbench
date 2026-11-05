<?php

namespace App\Logging;

use Monolog\Handler\NullHandler;
use Monolog\Logger;
use RuntimeException;

class CreatePostHogLogChannel
{
    public function __invoke(array $config): Logger
    {
        if (config('posthog.disabled')) {
            return new Logger('posthog', [new NullHandler()]);
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (blank($apiKey)) {
            $this->handleMissingConfiguration('POSTHOG_PROJECT_TOKEN');

            return new Logger('posthog', [new NullHandler()]);
        }

        if (blank($host)) {
            $this->handleMissingConfiguration('POSTHOG_HOST');

            return new Logger('posthog', [new NullHandler()]);
        }

        return new Logger('posthog', [new PostHogOtlpLogHandler($apiKey, $host)]);
    }

    protected function handleMissingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
