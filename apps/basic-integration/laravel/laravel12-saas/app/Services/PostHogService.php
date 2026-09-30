<?php

namespace App\Services;

use Closure;
use LogicException;
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

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (! self::$initialized) {
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
        if (! self::$initialized) {
            return;
        }

        PostHog::captureException($exception, $distinctId);
    }

    /**
     * Run work in a request-scoped PostHog context so captures and exceptions
     * inherit the authenticated user's stable identifier.
     *
     * @param array<string, array<int, string>> $headers
     */
    public function withRequestContext(array $headers, ?string $authenticatedDistinctId, Closure $callback): mixed
    {
        if (! self::$initialized) {
            return $callback();
        }

        $context = PostHog::contextFromHeaders($headers);

        if ($authenticatedDistinctId !== null) {
            $context['distinctId'] = $authenticatedDistinctId;
        }

        return PostHog::withContext($context, $callback, ['fresh' => true]);
    }

    private function handleMissingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
