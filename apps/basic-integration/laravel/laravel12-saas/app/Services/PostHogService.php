<?php

namespace App\Services;

use App\Models\User;
use PostHog\PostHog;
use RuntimeException;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey) {
            $this->handleMissingConfiguration('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (! $host) {
            $this->handleMissingConfiguration('POSTHOG_HOST');

            return;
        }

        if (! self::$initialized) {
            PostHog::init($apiKey, ['host' => $host]);
            self::$initialized = true;
        }
    }

    /**
     * Identify an authenticated user by the application's stable primary key.
     */
    public function identifyUser(User $user): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        PostHog::identify([
            'distinctId' => (string) $user->getKey(),
            'properties' => [
                'email' => $user->email,
                'name' => $user->name,
            ],
        ]);
    }

    /**
     * Capture an event for an authenticated user using the stable primary key.
     */
    public function captureUserEvent(User $user, string $event, array $properties = []): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        PostHog::capture([
            'distinctId' => (string) $user->getKey(),
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(\Throwable $exception, ?string $distinctId = null): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        PostHog::captureException($exception, $distinctId);
    }

    protected function handleMissingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
