<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use LogicException;
use PostHog\PostHog;

class PostHogService
{
    private static bool $initialized = false;

    private bool $configured = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! is_string($apiKey) || trim($apiKey) === '') {
            $this->missingConfiguration('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (! is_string($host) || trim($host) === '') {
            $this->missingConfiguration('POSTHOG_HOST');

            return;
        }

        if (! self::$initialized) {
            PostHog::init($apiKey, ['host' => $host]);
            self::$initialized = true;
        }

        $this->configured = true;
    }

    /**
     * Run the rest of an HTTP request in the PostHog context supplied by the
     * browser, preferring Laravel's authenticated user ID when one is known.
     */
    public function handle(Request $request, Closure $next): mixed
    {
        if (! $this->configured) {
            return $next($request);
        }

        $context = PostHog::contextFromHeaders($request->headers->all());
        $distinctId = $request->user()?->getAuthIdentifier();

        if ($distinctId !== null) {
            $context['distinctId'] = (string) $distinctId;
        }

        return PostHog::withContext(
            $context,
            fn (): mixed => $next($request),
            ['fresh' => true],
        );
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (! $this->configured) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $event, array $properties = []): void
    {
        if (! $this->configured) {
            return;
        }

        PostHog::capture([
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureFor(string $distinctId, string $event, array $properties = []): void
    {
        if (! $this->configured) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureException(\Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (! $this->configured) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    private function missingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
