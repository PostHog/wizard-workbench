<?php

namespace App\Services;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Auth;
use PostHog\PostHog;

class PostHogService
{
    private static bool $initialized = false;

    public function __construct()
    {
        if (self::$initialized || config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey || ! $host) {
            if (config('app.debug')) {
                $missing = ! $apiKey ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
                throw new \RuntimeException("{$missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$missing} is configured");
            }

            return;
        }

        PostHog::init($apiKey, ['host' => $host]);
        self::$initialized = true;
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (! self::$initialized) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function identifyUser(Authenticatable $user): void
    {
        $this->identify((string) $user->getAuthIdentifier(), array_filter([
            'email' => $user->email,
            'name' => $user->name,
        ], static fn ($value): bool => $value !== null && $value !== ''));
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (! self::$initialized) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(\Throwable $exception): void
    {
        if (! self::$initialized) {
            return;
        }

        $distinctId = (string) (Auth::id() ?? 'anonymous');
        PostHog::captureException($exception, $distinctId);
    }
}
