<?php

namespace App\Services;

use App\Models\User;
use PostHog\PostHog;
use Throwable;

class PostHogService
{
    public function identifyUser(User $user): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::identify([
            'distinctId' => (string) $user->getKey(),
            'properties' => [
                'email' => $user->email,
                'name' => $user->name,
                'signup_date' => $user->created_at?->toIso8601String(),
                'auth_provider' => $user->provider,
                'email_verified' => $user->hasVerifiedEmail(),
            ],
        ]);
    }

    public function capture(User $user, string $event, array $properties = []): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::capture([
            'distinctId' => (string) $user->getKey(),
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(Throwable $exception, ?User $user = null): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::captureException(
            $exception,
            $user ? (string) $user->getKey() : null,
            [
                '$current_url' => request()->fullUrl(),
                '$request_method' => request()->method(),
            ],
        );
    }

    private function isEnabled(): bool
    {
        return (bool) config('posthog.api_key') && ! config('posthog.disabled');
    }
}
