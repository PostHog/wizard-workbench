<?php

namespace App\Services;

use App\Models\User;
use LogicException;
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

        if (self::$initialized) {
            $this->enabled = true;

            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey) {
            $this->throwWhenDebugging('POSTHOG_KEY');

            return;
        }

        if (! $host) {
            $this->throwWhenDebugging('POSTHOG_HOST');

            return;
        }

        PostHog::init($apiKey, [
            'host' => $host,
            'error_tracking' => [
                'enabled' => true,
            ],
        ]);

        self::$initialized = true;
        $this->enabled = true;
    }

    public function identifyUser(User $user): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::identify([
            'distinctId' => (string) $user->getAuthIdentifier(),
            'properties' => array_filter([
                'email' => $user->email,
                'name' => $user->name,
            ], static fn (mixed $value): bool => $value !== null && $value !== ''),
        ]);
    }

    public function capture(User $user, string $event, array $properties = []): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::capture([
            'distinctId' => (string) $user->getAuthIdentifier(),
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(\Throwable $exception, ?string $distinctId, array $properties = []): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    private function throwWhenDebugging(string $variable): void
    {
        if (config('app.debug')) {
            throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
