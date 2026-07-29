<?php

namespace App\Services;

use Closure;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Request;
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

        if (!$apiKey || !$host) {
            if (config('app.debug')) {
                $missing = !$apiKey ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
                throw new \RuntimeException("{$missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$missing} is configured");
            }

            return;
        }

        PostHog::init($apiKey, ['host' => $host]);
        self::$initialized = true;
    }

    /**
     * Bind PostHog request context so captures and exception reports inherit the
     * authenticated user's stable identifier throughout the request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! self::$initialized) {
            return $next($request);
        }

        $context = PostHog::contextFromHeaders($request->headers->all());
        $user = $request->user();

        if ($user !== null) {
            $context['distinctId'] = (string) $user->getAuthIdentifier();
        }

        return PostHog::withContext(
            $context,
            static fn (): Response => $next($request),
            ['fresh' => true],
        );
    }

    /**
     * Identify a user when authentication establishes their account identity.
     */
    public function identifyUser(Authenticatable $user): void
    {
        $this->identify((string) $user->getAuthIdentifier(), array_filter([
            'email' => $user->email,
            'name' => $user->name,
        ], static fn (mixed $value): bool => $value !== null && $value !== ''));
    }

    /**
     * Capture an event using the identity bound by the request middleware.
     */
    public function capture(string $event, array $properties = []): void
    {
        if (!self::$initialized) {
            return;
        }

        $capture = [
            'event' => $event,
            'properties' => $properties,
        ];

        if (auth()->id() !== null) {
            $capture['distinctId'] = (string) auth()->id();
        }

        PostHog::capture($capture);
    }

    public function captureException(\Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (!self::$initialized) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (!self::$initialized) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }
}
