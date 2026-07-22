<?php

namespace App\Services;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use PostHog\PostHog;
use Symfony\Component\HttpFoundation\Response;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if (self::$initialized || config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey || ! $host) {
            if (app()->environment('local', 'development') || config('app.debug')) {
                $missing = ! $apiKey ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
                throw new \RuntimeException("{$missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$missing} is configured");
            }

            return;
        }

        PostHog::init($apiKey, ['host' => $host]);
        self::$initialized = true;
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

    public function identifyUser(User $user): void
    {
        $this->identify((string) $user->getAuthIdentifier(), array_filter([
            'email' => $user->email,
            'name' => $user->name,
        ], static fn (mixed $value): bool => $value !== null && $value !== ''));
    }

    public function __invoke(Request $request, Closure $next): Response
    {
        if (! self::$initialized) {
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

    public function capture(string $event, array $properties = []): void
    {
        if (! self::$initialized) {
            return;
        }

        $payload = [
            'event' => $event,
            'properties' => $properties,
        ];

        if (Auth::id() !== null) {
            $payload['distinctId'] = (string) Auth::id();
        }

        PostHog::capture($payload);
    }

    public function captureException(\Throwable $exception, ?string $distinctId = null): void
    {
        if (! self::$initialized) {
            return;
        }

        try {
            PostHog::captureException($exception, $distinctId ?? (Auth::id() !== null ? (string) Auth::id() : null));
        } catch (\Throwable $captureException) {
            Log::debug('PostHog exception capture failed.', ['exception' => $captureException]);
        }
    }
}
