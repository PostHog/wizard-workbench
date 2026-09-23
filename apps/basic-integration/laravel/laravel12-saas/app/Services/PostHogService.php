<?php

namespace App\Services;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use LogicException;
use PostHog\PostHog;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class PostHogService
{
    protected static bool $initialized = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey) {
            $this->throwMissingConfiguration('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (! $host) {
            $this->throwMissingConfiguration('POSTHOG_HOST');

            return;
        }

        if (! self::$initialized) {
            PostHog::init($apiKey, [
                'host' => $host,
                'debug' => config('posthog.debug'),
                'error_tracking' => [
                    'enabled' => true,
                ],
            ]);

            self::$initialized = true;
        }
    }

    /**
     * Identify a user after an authentication transition.
     */
    public function identify(User $user): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        PostHog::identify([
            'distinctId' => (string) $user->getAuthIdentifier(),
            'properties' => array_filter([
                'email' => $user->email,
                'name' => $user->name,
            ], static fn (?string $value): bool => $value !== null && $value !== ''),
        ]);
    }

    /**
     * Bind PostHog's request context so captures and exceptions inherit identity.
     *
     * An authenticated user ID takes precedence over client-controlled tracing headers.
     *
     * @param  Closure(Request): Response  $next
     */
    public function withRequestContext(Request $request, Closure $next): Response
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return $next($request);
        }

        $context = PostHog::contextFromHeaders($request->headers->all());

        if (($user = $request->user()) !== null) {
            $context['distinctId'] = (string) $user->getAuthIdentifier();
        }

        return PostHog::withContext(
            $context,
            static fn (): Response => $next($request),
            ['fresh' => true],
        );
    }

    /**
     * Capture a product event within the current request context.
     */
    public function capture(string $event, array $properties = [], ?string $distinctId = null): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        $payload = [
            'event' => $event,
            'properties' => $properties,
        ];

        if ($distinctId !== null) {
            $payload['distinctId'] = $distinctId;
        }

        PostHog::capture($payload);
    }

    public function captureException(Throwable $exception, ?string $distinctId = null): void
    {
        if (config('posthog.disabled') || ! self::$initialized) {
            return;
        }

        PostHog::captureException($exception, $distinctId);
    }

    private function throwMissingConfiguration(string $variable): void
    {
        if (config('posthog.debug')) {
            throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
