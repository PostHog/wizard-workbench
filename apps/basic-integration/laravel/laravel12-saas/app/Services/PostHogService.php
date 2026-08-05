<?php

namespace App\Services;

use LogicException;
use PostHog\PostHog;

class PostHogService
{
    private static bool $initialized = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey || ! $host) {
            if (config('posthog.debug')) {
                $missingVariable = ! $apiKey ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';

                throw new LogicException("{$missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$missingVariable} is configured");
            }

            return;
        }

        if (! self::$initialized) {
            PostHog::init($apiKey, [
                'host' => $host,
            ]);

            self::$initialized = true;
        }
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (! self::$initialized) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (! self::$initialized) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(\Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (! self::$initialized) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    public function flush(): void
    {
        if (self::$initialized) {
            PostHog::flush();
        }
    }
}
