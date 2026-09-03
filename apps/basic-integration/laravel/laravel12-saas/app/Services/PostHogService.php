<?php

namespace App\Services;

use PostHog\PostHog;
use RuntimeException;

class PostHogService
{
    protected static bool $initialized = false;

    protected bool $enabled;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            $this->enabled = false;

            return;
        }

        $this->enabled = filled(config('posthog.api_key')) && filled(config('posthog.host'));

        if (! $this->enabled) {
            if (config('app.debug')) {
                foreach (['POSTHOG_PROJECT_TOKEN', 'POSTHOG_HOST'] as $variable) {
                    if (! filled(config($variable === 'POSTHOG_PROJECT_TOKEN' ? 'posthog.api_key' : 'posthog.host'))) {
                        throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
                    }
                }
            }

            return;
        }

        if (! self::$initialized) {
            PostHog::init(config('posthog.api_key'), [
                'host' => config('posthog.host'),
            ]);

            self::$initialized = true;
        }
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

    public function captureException(\Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }
}
