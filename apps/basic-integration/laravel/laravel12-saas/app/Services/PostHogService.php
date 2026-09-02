<?php

namespace App\Services;

use LogicException;
use PostHog\PostHog;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if (config('posthog.disabled') || self::$initialized) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey || ! $host) {
            if (config('app.debug')) {
                $missingVariable = ! $apiKey ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';

                throw new LogicException("{$missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$missingVariable} is configured");
            }

            return;
        }

        PostHog::init($apiKey, ['host' => $host]);

        self::$initialized = true;
    }

    /**
     * @param  array<string, mixed>  $properties
     */
    public function identify(string $distinctId, array $properties = []): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    /**
     * @param  array<string, mixed>  $properties
     */
    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
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
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        $userId = auth()->id();

        PostHog::captureException($exception, $userId !== null ? (string) $userId : null);
    }
}
