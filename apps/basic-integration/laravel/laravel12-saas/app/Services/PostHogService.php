<?php

namespace App\Services;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use PostHog\PostHog;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class PostHogService
{
    private static bool $initialized = false;

    private bool $enabled = false;

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

    public function captureException(Throwable $exception, ?string $distinctId = null, array $properties = []): void
    {
        if (! $this->enabled) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $properties);
    }

    /**
     * Bind PostHog's request context so captures and exceptions inherit the authenticated user.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $distinctId = $user instanceof User ? (string) $user->getKey() : null;

        return $this->withRequestContext(
            $request,
            $distinctId,
            $user instanceof User ? [
                'email' => $user->email,
                'name' => $user->name,
            ] : [],
            fn (): Response => $next($request),
        );
    }

    /**
     * Run work in the PostHog context constructed from tracing headers and authenticated identity.
     */
    public function withRequestContext(Request $request, ?string $distinctId, array $personProperties, Closure $callback): mixed
    {
        if (! $this->enabled) {
            return $callback();
        }

        $headers = array_map(
            static fn (array $values): string => (string) reset($values),
            $request->headers->all(),
        );

        if ($distinctId !== null) {
            // The server-authenticated ID takes precedence over client-controlled tracing headers.
            $headers['X-POSTHOG-DISTINCT-ID'] = $distinctId;
        }

        $context = PostHog::contextFromHeaders($headers);

        return PostHog::withContext($context, function () use ($callback, $distinctId, $personProperties): mixed {
            if ($distinctId !== null) {
                $this->identify($distinctId, $personProperties);
            }

            return $callback();
        });
    }

    private function handleMissingConfiguration(string $variable): void
    {
        if (config('app.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
