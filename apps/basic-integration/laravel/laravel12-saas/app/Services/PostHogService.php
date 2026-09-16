<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use LogicException;
use PostHog\PostHog;
use Throwable;

class PostHogService
{
    private static bool $initialized = false;

    public function __construct()
    {
        $this->initialize();
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (! $this->initialize()) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $event, array $properties = [], ?string $distinctId = null): void
    {
        if (! $this->initialize()) {
            return;
        }

        $eventData = [
            'event' => $event,
            'properties' => $properties,
        ];

        if ($distinctId !== null) {
            $eventData['distinctId'] = $distinctId;
        }

        PostHog::capture($eventData);
    }

    public function captureException(Throwable $exception, ?string $distinctId = null): void
    {
        if (! $this->initialize()) {
            return;
        }

        PostHog::captureException($exception, $distinctId);
    }

    public function withRequestContext(Request $request, Closure $callback): mixed
    {
        if (! $this->initialize()) {
            return $callback();
        }

        $context = PostHog::contextFromHeaders($request->headers->all());
        $distinctId = auth()->id();

        if ($distinctId !== null) {
            $context['distinctId'] = (string) $distinctId;
        }

        return PostHog::withContext($context, $callback, ['fresh' => true]);
    }

    private function initialize(): bool
    {
        if (config('posthog.disabled')) {
            return false;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (blank($apiKey)) {
            $this->throwIfDebug('POSTHOG_PROJECT_TOKEN');

            return false;
        }

        if (blank($host)) {
            $this->throwIfDebug('POSTHOG_HOST');

            return false;
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

        return true;
    }

    private function throwIfDebug(string $variable): void
    {
        if (config('app.debug')) {
            throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
