<?php

namespace App\Services;

use PostHog\PostHog;
use RuntimeException;

class PostHogService
{
    private static bool $initialized = false;

    private bool $enabled = false;

    public function __construct()
    {
        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! filled($apiKey)) {
            $this->throwIfMissingInDevelopment('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (! filled($host)) {
            $this->throwIfMissingInDevelopment('POSTHOG_HOST');

            return;
        }

        if (config('posthog.disabled')) {
            return;
        }

        if (! self::$initialized) {
            PostHog::init($apiKey, [
                'host' => $host,
                'error_tracking' => [
                    'enabled' => true,
                ],
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

    public function captureException(\Throwable $exception): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::captureException(
            $exception,
            auth()->id() !== null ? (string) auth()->id() : null,
            [
                '$request_method' => request()->method(),
            ]
        );
    }

    private function throwIfMissingInDevelopment(string $variable): void
    {
        if (app()->environment(['local', 'development']) || config('app.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
