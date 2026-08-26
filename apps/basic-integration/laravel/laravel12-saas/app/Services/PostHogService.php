<?php

namespace App\Services;

use LogicException;
use PostHog\PostHog;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if ($this->isDisabled()) {
            return;
        }

        if (! self::$initialized) {
            PostHog::init(config('posthog.api_key'), [
                'host' => config('posthog.host'),
                'debug' => config('posthog.debug'),
            ]);

            self::$initialized = true;
        }
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if ($this->isDisabled()) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if ($this->isDisabled()) {
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
        if ($this->isDisabled()) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    private function isDisabled(): bool
    {
        foreach (['api_key' => 'POSTHOG_PROJECT_TOKEN', 'host' => 'POSTHOG_HOST'] as $key => $variable) {
            if (blank(config("posthog.{$key}"))) {
                if (config('posthog.debug')) {
                    throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
                }

                return true;
            }
        }

        return config('posthog.disabled');
    }
}
