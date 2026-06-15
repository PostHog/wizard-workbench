<?php

namespace App\Services;

use PostHog\PostHog;
use Illuminate\Support\Facades\Auth;

class PostHogService
{
    protected static $initialized = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        if (!self::$initialized) {
            PostHog::init(
                config('posthog.api_key'),
                [
                    'host' => config('posthog.host'),
                    'debug' => config('posthog.debug'),
                ]
            );
            self::$initialized = true;
        }
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

    public function captureException(\Throwable $exception, ?string $distinctId = null): ?string
    {
        if (config('posthog.disabled')) {
            return null;
        }

        $distinctId = $distinctId ?? Auth::user()?->email ?? 'anonymous';

        $eventId = uniqid('error_', true);

        PostHog::captureException($exception, $distinctId, [
            'error_id' => $eventId,
        ]);

        return $eventId;
    }
}
