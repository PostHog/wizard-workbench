<?php

namespace App\Services;

use PostHog\PostHog;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if (config('posthog.disabled') || self::$initialized) {
            return;
        }

        PostHog::init(config('posthog.api_key'), [
            'host' => config('posthog.host'),
            'debug' => config('posthog.debug'),
        ]);

        self::$initialized = true;
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (config('posthog.disabled')) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (config('posthog.disabled')) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(\Throwable $exception, string $distinctId): void
    {
        if (config('posthog.disabled')) {
            return;
        }

        PostHog::captureException($exception, $distinctId);
    }
}
