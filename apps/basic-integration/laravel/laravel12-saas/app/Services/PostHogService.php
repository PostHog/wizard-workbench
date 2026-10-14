<?php

namespace App\Services;

use PostHog\PostHog;
use RuntimeException;

class PostHogService
{
    private static bool $initialized = false;

    private bool $enabled;

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

        if (! self::$initialized) {
            PostHog::init($apiKey, [
                'host' => $host,
                'error_tracking' => [
                    'enabled' => true,
                ],
            ]);
            self::$initialized = true;
        }
    }

    public function isEnabled(): bool
    {
        return $this->enabled;
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

    public function captureException(\Throwable $exception, ?string $distinctId = null): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::captureException($exception, $distinctId);
    }
}
