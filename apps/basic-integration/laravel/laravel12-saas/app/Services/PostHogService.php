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
        if (config('posthog.disabled')) {
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

        if (! self::$initialized) {
            PostHog::init($apiKey, ['host' => $host]);
            self::$initialized = true;
        }
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

        PostHog::captureException(
            $exception,
            $distinctId ?? (auth()->id() !== null ? (string) auth()->id() : null)
        );
    }

    /**
     * Run work within the analytics context associated with the current request.
     *
     * @param  array<string, array<int, string>>  $headers
     */
    public function withRequestContext(array $headers, ?string $distinctId, Closure $callback): mixed
    {
        if (! self::$initialized) {
            return $callback();
        }

        $context = PostHog::contextFromHeaders($headers);

        if ($distinctId !== null) {
            $context['distinctId'] = $distinctId;
        }

        return PostHog::withContext($context, $callback);
    }

    private function handleMissingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
