<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use PostHog\PostHog;

class PostHogService
{
    public function identify(string $distinctId, array $properties = []): void
    {
        if (config('posthog.disabled')) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (config('posthog.disabled')) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(\Throwable $exception, ?string $distinctId = null): ?string
    {
        if (config('posthog.disabled')) {
            return null;
        }

        $distinctId = $distinctId ?? (Auth::id() !== null ? (string) Auth::id() : 'anonymous');

        $eventId = uniqid('error_', true);

        PostHog::captureException($exception, $distinctId, [
            'error_id' => $eventId,
        ]);

        return $eventId;
    }

    public function isFeatureEnabled(string $key, string $distinctId, array $properties = []): ?bool
    {
        if (config('posthog.disabled')) {
            return false;
        }

        return PostHog::isFeatureEnabled($key, $distinctId, $properties);
    }

    public function getFeatureFlagPayload(string $key, string $distinctId): mixed
    {
        if (config('posthog.disabled')) {
            return null;
        }

        return PostHog::getFeatureFlagPayload($key, $distinctId);
    }
}
