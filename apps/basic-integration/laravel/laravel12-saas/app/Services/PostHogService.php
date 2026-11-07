<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PostHog\PostHog;
use Symfony\Component\HttpFoundation\Response;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        $this->initialize();
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (! $this->isEnabled()) {
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
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    /**
     * Run a request with PostHog's request-scoped identity and tracing context.
     */
    public function withRequestContext(Request $request, Closure $next): Response
    {
        if (! $this->isEnabled()) {
            return $next($request);
        }

        $context = PostHog::contextFromHeaders($request->headers->all());
        $user = $request->user();

        if ($user !== null) {
            $context['distinctId'] = (string) $user->getAuthIdentifier();
        }

        return PostHog::withContext(
            $context,
            fn (): Response => $next($request),
            ['fresh' => true],
        );
    }

    private function initialize(): void
    {
        if ($this->isEnabled()) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (config('posthog.disabled') || ! $apiKey || ! $host) {
            $this->warnAboutMissingConfiguration($apiKey, $host);

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

    private function isEnabled(): bool
    {
        return self::$initialized && ! config('posthog.disabled');
    }

    private function warnAboutMissingConfiguration(?string $apiKey, ?string $host): void
    {
        if (app()->environment('production') || config('posthog.disabled')) {
            return;
        }

        if (! $apiKey) {
            Log::warning('POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured');
        }

        if (! $host) {
            Log::warning('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured');
        }
    }
}
