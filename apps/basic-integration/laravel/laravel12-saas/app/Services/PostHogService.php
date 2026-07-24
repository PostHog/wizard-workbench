<?php

namespace App\Services;

use App\Models\User;
use PostHog\PostHog;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if (self::$initialized || config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey) {
            if (config('app.debug')) {
                throw new \RuntimeException('POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured');
            }

            return;
        }

        if (! $host) {
            if (config('app.debug')) {
                throw new \RuntimeException('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured');
            }

            return;
        }

        PostHog::init($apiKey, ['host' => $host]);
        self::$initialized = true;
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

    public function captureException(\Throwable $exception, ?string $distinctId, array $properties = []): void
    {
        if (! self::$initialized) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    public function identifyUser(User $user): void
    {
        $this->identify((string) $user->getKey(), array_filter([
            'email' => $user->email,
            'name' => $user->name,
        ], static fn (mixed $value): bool => $value !== null && $value !== ''));
    }
}
