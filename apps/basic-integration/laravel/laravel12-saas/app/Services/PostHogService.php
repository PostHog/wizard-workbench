<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use PostHog\PostHog;
use RuntimeException;

class PostHogService
{
    private bool $enabled = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $this->isConfigured($apiKey, 'POSTHOG_PROJECT_TOKEN') || ! $this->isConfigured($host, 'POSTHOG_HOST')) {
            return;
        }

        PostHog::init($apiKey, [
            'host' => $host,
        ]);

        $this->enabled = true;
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function withRequestContext(Request $request, Closure $next): mixed
    {
        if (! $this->enabled) {
            return $next($request);
        }

        $context = PostHog::contextFromHeaders($request->headers->all());

        if ($user = $request->user()) {
            $context['distinctId'] = (string) $user->getAuthIdentifier();
        }

        return PostHog::withContext(
            $context,
            static fn () => $next($request),
            ['fresh' => true],
        );
    }

    public function captureException(\Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    private function isConfigured(mixed $value, string $variable): bool
    {
        if (is_string($value) && trim($value) !== '') {
            return true;
        }

        if (config('app.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }

        return false;
    }
}
