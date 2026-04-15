<?php

namespace App\Services;

use PostHog\PostHog;

class PostHogService
{
    public static function init(): void
    {
        $apiKey = config('posthog.api_key');

        if (empty($apiKey) || config('posthog.disabled')) {
            return;
        }

        PostHog::init($apiKey, [
            'host' => config('posthog.host'),
        ]);
    }

    public static function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (empty(config('posthog.api_key')) || config('posthog.disabled')) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public static function identify(string $distinctId, array $properties = []): void
    {
        if (empty(config('posthog.api_key')) || config('posthog.disabled')) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }
}
