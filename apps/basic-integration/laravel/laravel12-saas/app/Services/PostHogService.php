<?php

namespace App\Services;

use LogicException;
use PostHog\PostHog;

class PostHogService
{
    private static bool $initialized = false;

    private bool $disabled;

    public function __construct()
    {
        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        $this->disabled = (bool) config('posthog.disabled') || blank($apiKey) || blank($host);

        if ($this->disabled) {
            if (config('app.debug')) {
                if (blank($apiKey)) {
                    throw new LogicException('POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured');
                }

                if (blank($host)) {
                    throw new LogicException('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured');
                }
            }

            return;
        }

        if (! self::$initialized) {
            PostHog::init($apiKey, [
                'host' => $host,
                'debug' => config('posthog.debug'),
            ]);

            self::$initialized = true;
        }
    }

    public function captureException(\Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if ($this->disabled) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    /**
     * @param  array<string, mixed>  $properties
     */
    public function capture(string $event, array $properties = [], ?string $distinctId = null): void
    {
        if ($this->disabled) {
            return;
        }

        $payload = [
            'event' => $event,
            'properties' => $properties,
        ];

        if ($distinctId !== null) {
            $payload['distinctId'] = $distinctId;
        }

        PostHog::capture($payload);
    }

    /**
     * @param  array<string, mixed>  $properties
     */
    public function identify(string $distinctId, array $properties = []): void
    {
        if ($this->disabled) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function isDisabled(): bool
    {
        return $this->disabled;
    }
}
