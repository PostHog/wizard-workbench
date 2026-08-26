<?php

namespace App\Services;

use PostHog\PostHog;
use RuntimeException;
use Throwable;

class PostHogService
{
    protected static bool $initialized = false;

    protected bool $enabled = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (blank($apiKey)) {
            $this->throwWhenDebugging('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (blank($host)) {
            $this->throwWhenDebugging('POSTHOG_HOST');

            return;
        }

        if (! self::$initialized) {
            PostHog::init($apiKey, [
                'host' => $host,
            ]);

            self::$initialized = true;
        }

        $this->enabled = true;
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::captureException(
            $exception,
            $distinctId ?? 'anonymous',
            $properties,
        );
    }

    public function flush(): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::flush();
    }

    protected function throwWhenDebugging(string $variable): void
    {
        if (config('posthog.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
