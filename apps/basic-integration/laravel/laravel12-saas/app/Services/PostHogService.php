<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use PostHog\PostHog;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

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
            $this->handleMissingConfiguration('POSTHOG_API_KEY');

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

    /**
     * Bind PostHog identity to the lifetime of the current web request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! self::$initialized) {
            return $next($request);
        }

        $context = PostHog::contextFromHeaders($request->headers->all());

        if ($user = $request->user()) {
            $context['distinctId'] = (string) $user->getAuthIdentifier();
        }

        return PostHog::withContext(
            $context,
            static fn (): Response => $next($request),
            ['fresh' => true]
        );
    }

    /**
     * Capture an event within the current request context, or for an explicitly
     * supplied distinct ID when identity changes during the request.
     */
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

    public function captureException(\Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    private function handleMissingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
