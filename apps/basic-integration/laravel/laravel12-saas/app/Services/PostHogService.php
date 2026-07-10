<?php

namespace App\Services;

use PostHog\PostHog;
use Throwable;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if (! $this->isEnabled()) {
            return;
        }

        if (! self::$initialized) {
            PostHog::init(config('services.posthog.api_key'), [
                'host' => config('services.posthog.host'),
            ]);

            self::$initialized = true;
        }
    }

    public function isEnabled(): bool
    {
        return filled(config('services.posthog.api_key')) && ! config('services.posthog.disabled', false);
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (! $this->isEnabled()) {
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
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }
}
