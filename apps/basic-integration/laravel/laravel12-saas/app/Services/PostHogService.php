<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use LogicException;
use PostHog\PostHog;
use Symfony\Component\HttpFoundation\Response;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if ($this->isDisabled()) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey) {
            $this->throwIfDebugging('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (! $host) {
            $this->throwIfDebugging('POSTHOG_HOST');

            return;
        }

        if (! self::$initialized) {
            PostHog::init($apiKey, [
                'host' => $host,
                'error_tracking' => [
                    'enabled' => true,
                    'context_provider' => static function (array $payload): array {
                        return [
                            'distinctId' => auth()->id() !== null ? (string) auth()->id() : null,
                            'properties' => array_filter([
                                '$current_url' => request()->url(),
                                '$request_method' => request()->method(),
                                '$exception_source' => $payload['source'] ?? null,
                            ], static fn ($value): bool => $value !== null && $value !== ''),
                        ];
                    },
                ],
            ]);
            self::$initialized = true;
        }
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if ($this->isDisabled() || ! $this->isConfigured()) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function capture(string $event, array $properties = []): void
    {
        if ($this->isDisabled() || ! $this->isConfigured()) {
            return;
        }

        PostHog::capture([
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function captureForDistinctId(string $distinctId, string $event, array $properties = []): void
    {
        if ($this->isDisabled() || ! $this->isConfigured()) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function identifyAuthenticatedUser(): void
    {
        $user = Auth::user();

        if ($user === null) {
            return;
        }

        $this->identify((string) $user->getAuthIdentifier(), array_filter([
            'email' => $user->getAttribute('email'),
            'name' => $user->getAttribute('name'),
        ], static fn ($value): bool => $value !== null && $value !== ''));
    }

    public function withRequestContext(Request $request, Closure $next): Response
    {
        if ($this->isDisabled() || ! $this->isConfigured()) {
            return $next($request);
        }

        $context = PostHog::contextFromHeaders($request->headers->all());

        if (Auth::id() !== null) {
            $context['distinctId'] = (string) Auth::id();
        }

        return PostHog::withContext(
            $context,
            static fn (): Response => $next($request),
            ['fresh' => true]
        );
    }

    public function captureException(\Throwable $exception, ?string $distinctId, array $properties = []): void
    {
        if ($this->isDisabled() || ! $this->isConfigured()) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    private function isDisabled(): bool
    {
        return (bool) config('posthog.disabled');
    }

    private function isConfigured(): bool
    {
        return (bool) config('posthog.api_key') && (bool) config('posthog.host');
    }

    private function throwIfDebugging(string $variable): void
    {
        if (config('app.debug')) {
            throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
