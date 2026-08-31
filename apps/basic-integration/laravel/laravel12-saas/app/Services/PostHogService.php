<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use LogicException;
use PostHog\PostHog;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if ($this->isDisabled()) {
            return;
        }

        if (! self::$initialized) {
            PostHog::init(config('posthog.api_key'), [
                'host' => config('posthog.host'),
            ]);

            self::$initialized = true;
        }
    }

    public function handle(Request $request, Closure $next): mixed
    {
        if ($this->isDisabled()) {
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

    public function identify(string $distinctId, array $properties = []): void
    {
        if ($this->isDisabled()) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function identifyUser(object $user): void
    {
        $this->identify((string) $user->getAuthIdentifier(), [
            'email' => $user->email,
            'name' => $user->name,
        ]);
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if ($this->isDisabled()) {
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
        if ($this->isDisabled()) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    private function isDisabled(): bool
    {
        if (config('posthog.disabled')) {
            return true;
        }

        $settings = [
            'POSTHOG_PROJECT_TOKEN' => 'api_key',
            'POSTHOG_HOST' => 'host',
        ];

        foreach ($settings as $variable => $key) {
            if (blank(config("posthog.{$key}"))) {
                if (config('app.debug')) {
                    throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
                }

                return true;
            }
        }

        return false;
    }
}
