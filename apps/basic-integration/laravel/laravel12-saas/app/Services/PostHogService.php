<?php

namespace App\Services;

class PostHogService
{
    private static bool $initialized = false;

    private bool $available = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (blank($apiKey)) {
            $this->handleMissingConfiguration('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (blank($host)) {
            $this->handleMissingConfiguration('POSTHOG_HOST');

            return;
        }

        if (! self::$initialized) {
            \PostHog\PostHog::init($apiKey, [
                'host' => $host,
                'error_tracking' => [
                    'enabled' => true,
                ],
            ]);

            self::$initialized = true;
        }

        $this->available = true;
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (! $this->available) {
            return;
        }

        \PostHog\PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (! $this->available) {
            return;
        }

        \PostHog\PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(\Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (! $this->available) {
            return;
        }

        \PostHog\PostHog::captureException($exception, $distinctId, $properties);
    }

    public function flush(): void
    {
        if ($this->available) {
            \PostHog\PostHog::flush();
        }
    }

    private function handleMissingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new \RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
