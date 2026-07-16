<?php

namespace App\Services;

use PostHog\PostHog;
use Throwable;

class PostHogService
{
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

    public function captureException(Throwable $exception, ?string $distinctId = null): void
    {
        if (config('posthog.disabled')) {
            return;
        }

        PostHog::captureException($exception, $distinctId);
    }
}
