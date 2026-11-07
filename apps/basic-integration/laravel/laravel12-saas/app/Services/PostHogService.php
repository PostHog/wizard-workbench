<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use PostHog\PostHog;
use Throwable;

class PostHogService
{
    protected static bool $initialized = false;

    protected bool $enabled = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey || ! $host) {
            if (! app()->environment('production')) {
                $missingVariable = ! $apiKey ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
                Log::warning("{$missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$missingVariable} is configured");
            }

            return;
        }

        try {
            if (! self::$initialized) {
                PostHog::init($apiKey, ['host' => $host]);
                self::$initialized = true;
            }
        } catch (Throwable) {
            return;
        }

        $this->enabled = true;
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        $this->send(fn () => PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]));
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        $this->send(fn () => PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]));
    }

    public function captureException(Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        $this->send(fn () => PostHog::captureException($exception, $distinctId, $properties));
    }

    protected function send(callable $operation): void
    {
        if (! $this->enabled) {
            return;
        }

        try {
            $operation();
        } catch (Throwable) {
        }
    }
}
