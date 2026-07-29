<?php

namespace App\Services;

use PostHog\PostHog;
use RuntimeException;

class PostHogService
{
    private static bool $initialized = false;

    public function __construct()
    {
        $this->initialize();
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (!$this->isReady()) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (!$this->isReady()) {
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
        if (!$this->isReady()) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    private function initialize(): void
    {
        if (self::$initialized || config('posthog.disabled', false)) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (!$apiKey) {
            $this->missingConfiguration('POSTHOG_PROJECT_TOKEN');
            return;
        }

        if (!$host) {
            $this->missingConfiguration('POSTHOG_HOST');
            return;
        }

        PostHog::init($apiKey, ['host' => $host]);
        self::$initialized = true;
    }

    private function isReady(): bool
    {
        return !config('posthog.disabled', false) && self::$initialized;
    }

    private function missingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
