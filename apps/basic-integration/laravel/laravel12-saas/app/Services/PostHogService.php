<?php

namespace App\Services;

use App\Models\User;
use LogicException;
use PostHog\PostHog;

class PostHogService
{
    private static bool $initialized = false;

    public function __construct()
    {
        if (! $this->isEnabled()) {
            return;
        }

        if (! self::$initialized) {
            PostHog::init(config('posthog.api_key'), [
                'host' => config('posthog.host'),
            ]);

            self::$initialized = true;
        }
    }

    public function identify(User $user): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::identify([
            'distinctId' => (string) $user->getAuthIdentifier(),
            'properties' => array_filter([
                'email' => $user->email,
                'name' => $user->name,
            ], static fn (mixed $value): bool => filled($value)),
        ]);
    }

    public function capture(User $user, string $event, array $properties = []): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::capture([
            'distinctId' => (string) $user->getAuthIdentifier(),
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(\Throwable $exception, ?string $distinctId = null): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::captureException($exception, $distinctId);
    }

    public function isEnabled(): bool
    {
        if (config('posthog.disabled')) {
            return false;
        }

        foreach (['POSTHOG_PROJECT_TOKEN' => config('posthog.api_key'), 'POSTHOG_HOST' => config('posthog.host')] as $variable => $value) {
            if (filled($value)) {
                continue;
            }

            if (config('app.debug')) {
                throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
            }

            return false;
        }

        return true;
    }
}
