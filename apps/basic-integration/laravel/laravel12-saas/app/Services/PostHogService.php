<?php

namespace App\Services;

use App\Models\User;
use PostHog\PostHog;

class PostHogService
{
    private static bool $initialized = false;

    private bool $enabled = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (blank($apiKey)) {
            $this->handleMissingConfiguration('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (blank($host)) {
            $this->handleMissingConfiguration('POSTHOG_HOST');

            return;
        }

        if (! self::$initialized) {
            PostHog::init($apiKey, [
                'host' => $host,
                'error_tracking' => [
                    'enabled' => true,
                ],
            ]);
            self::$initialized = true;
        }

        $this->enabled = true;
    }

    public function identifyUser(User $user): void
    {
        if (! $this->enabled) {
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

    public function captureException(\Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (! $this->enabled) {
            return;
        }

        $authenticatedId = auth()->id();
        $distinctId ??= $authenticatedId === null ? null : (string) $authenticatedId;

        PostHog::captureException($exception, $distinctId, $properties);
    }

    private function handleMissingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new \RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
