<?php

namespace App\Services;

use App\Models\User;
use PostHog\PostHog;
use RuntimeException;

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
                throw new RuntimeException("{$missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$missing} is configured");
            }

            return;
        }

        PostHog::init($apiKey, ['host' => $host]);
        self::$initialized = true;
    }

    public function identify(User $user): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        PostHog::identify([
            'distinctId' => (string) $user->getAuthIdentifier(),
            'properties' => [
                'email' => $user->email,
                'name' => $user->name,
            ],
        ]);
    }

    public function capture(User $user, string $event, array $properties = []): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        PostHog::capture([
            'distinctId' => (string) $user->getAuthIdentifier(),
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(\Throwable $exception): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        PostHog::captureException(
            $exception,
            auth()->id() !== null ? (string) auth()->id() : null,
            [
                '$request_method' => request()->method(),
            ]
        );
    }
}
