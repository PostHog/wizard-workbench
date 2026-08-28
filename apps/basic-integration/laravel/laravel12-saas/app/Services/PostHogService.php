<?php

namespace App\Services;

use App\Models\User;
use LogicException;
use PostHog\PostHog;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if (config('posthog.disabled') || ! $this->hasConfiguration()) {
            return;
        }

        if (! self::$initialized) {
            PostHog::init(config('posthog.api_key'), [
                'host' => config('posthog.host'),
            ]);

            self::$initialized = true;
        }
    }

    public function isEnabled(): bool
    {
        return ! config('posthog.disabled') && $this->hasConfiguration();
    }

    public function identifyUser(User $user): void
    {
        if (! $this->isEnabled()) {
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

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
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

    private function hasConfiguration(): bool
    {
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
