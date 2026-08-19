<?php

namespace App\Services;

use LogicException;
use PostHog\PostHog;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        $this->ensureConfigured();

        if ($this->isDisabled()) {
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
        return (bool) config('posthog.disabled')
            || ! config('posthog.api_key')
            || ! config('posthog.host');
    }

    private function ensureConfigured(): void
    {
        foreach (['POSTHOG_PROJECT_TOKEN' => config('posthog.api_key'), 'POSTHOG_HOST' => config('posthog.host')] as $variable => $value) {
            if (! $value && config('app.debug')) {
                throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
            }
        }
    }
}
