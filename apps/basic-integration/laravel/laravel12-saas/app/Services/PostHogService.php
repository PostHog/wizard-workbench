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
            PostHog::init($apiKey, [
                'host' => $host,
                'error_tracking' => [
                    'enabled' => true,
                ],
            ]);
            self::$initialized = true;
        }
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

    public function withRequestContext(Request $request, Closure $callback): mixed
    {
        if (! $this->isEnabled()) {
            return $callback();
        }

        $context = PostHog::contextFromHeaders($request->headers->all());

        if ($user = $request->user()) {
            $context['distinctId'] = (string) $user->getAuthIdentifier();
        }

        return PostHog::withContext($context, $callback);
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

    public function captureException(\Throwable $exception, ?string $distinctId = null): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        PostHog::captureException($exception, $distinctId);
    }

    public function flush(): void
    {
        if ($this->isEnabled()) {
            PostHog::flush();
        }
    }

    private function isEnabled(): bool
    {
        return ! config('posthog.disabled')
            && filled(config('posthog.api_key'))
            && filled(config('posthog.host'));
    }

    private function handleMissingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
