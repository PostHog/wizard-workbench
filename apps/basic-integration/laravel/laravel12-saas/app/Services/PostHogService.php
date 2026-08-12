<?php

namespace App\Services;

use LogicException;
use PostHog\PostHog;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            $this->throwIfConfigurationIsMissing();

            return;
        }

        if (! self::$initialized) {
            PostHog::init(config('posthog.api_key'), [
                'host' => config('posthog.host'),
            ]);

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

    public function captureException(\Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (config('posthog.disabled')) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    private function throwIfConfigurationIsMissing(): void
    {
        if (! config('posthog.debug')) {
            return;
        }

        foreach ([
            'POSTHOG_PROJECT_TOKEN' => 'api_key',
            'POSTHOG_HOST' => 'host',
        ] as $variable => $setting) {
            if (blank(config("posthog.{$setting}"))) {
                throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
            }
        }
    }
}
