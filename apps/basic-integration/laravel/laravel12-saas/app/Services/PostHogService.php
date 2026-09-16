<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use PostHog\PostHog;
use RuntimeException;

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
            $this->handleMissingConfiguration('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (! $host) {
            $this->handleMissingConfiguration('POSTHOG_HOST');

            return;
        }

        PostHog::init($apiKey, [
            'host' => $host,
            'error_tracking' => [
                'enabled' => true,
            ],
        ]);

        self::$initialized = true;
    }

    public function capture(string $event, array $properties = [], ?string $distinctId = null): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
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
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        PostHog::captureException($exception, $distinctId);
    }

    public function handle(Request $request, Closure $next): mixed
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return $next($request);
        }

        $context = PostHog::contextFromHeaders($request->headers->all());

        if (auth()->id() !== null) {
            $context['distinctId'] = (string) auth()->id();
        }

        return PostHog::withContext(
            $context,
            static fn (): mixed => $next($request),
            ['fresh' => true],
        );
    }

    private function handleMissingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
