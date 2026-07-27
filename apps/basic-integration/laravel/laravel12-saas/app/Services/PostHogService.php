<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use PostHog\PostHog;

class PostHogService
{
    private static bool $initialized = false;

    public function __construct()
    {
        if (config('posthog.disabled') || self::$initialized) {
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

        PostHog::init($apiKey, [
            'host' => $host,
            'debug' => config('posthog.debug'),
        ]);

        self::$initialized = true;
    }

    public function withinRequestContext(Request $request, ?string $distinctId, Closure $callback): mixed
    {
        if (! self::$initialized) {
            return $callback();
        }

        $context = PostHog::contextFromHeaders($request->headers->all());

        if ($distinctId !== null) {
            $context['distinctId'] = $distinctId;
        }

        return PostHog::withContext($context, $callback);
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

    public function capture(string $event, array $properties = [], ?string $distinctId = null): void
    {
        if (! self::$initialized) {
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

    public function captureException(\Throwable $exception, ?string $distinctId = null): void
    {
        if (! self::$initialized) {
            return;
        }

        PostHog::captureException($exception, $distinctId ?? 'anonymous');
    }
}
