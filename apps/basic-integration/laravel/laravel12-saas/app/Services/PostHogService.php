<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use PostHog\PostHog;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');

        if (empty($apiKey)) {
            if (config('app.debug')) {
                trigger_error(
                    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured',
                    E_USER_WARNING
                );
            }

            return;
        }

        if (! self::$initialized) {
            PostHog::init($apiKey, [
                'host' => config('posthog.host'),
                'debug' => config('posthog.debug'),
            ]);
            self::$initialized = true;
        }
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (config('posthog.disabled') || empty(config('posthog.api_key'))) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (config('posthog.disabled') || empty(config('posthog.api_key'))) {
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
        if (config('posthog.disabled') || empty(config('posthog.api_key'))) {
            return null;
        }

        $distinctId = $distinctId ?? Auth::user()?->email ?? 'anonymous';
        $eventId = uniqid('error_', true);

        PostHog::captureException($exception, $distinctId, [
            'error_id' => $eventId,
        ]);

        return $eventId;
    }

    public function isFeatureEnabled(string $key, string $distinctId, array $properties = []): ?bool
    {
        if (config('posthog.disabled') || empty(config('posthog.api_key'))) {
            return false;
        }

        return PostHog::isFeatureEnabled($key, $distinctId, $properties);
    }

    public function getFeatureFlagPayload(string $key, string $distinctId): mixed
    {
        if (config('posthog.disabled') || empty(config('posthog.api_key'))) {
            return null;
        }

        return PostHog::getFeatureFlagPayload($key, $distinctId);
    }
}
