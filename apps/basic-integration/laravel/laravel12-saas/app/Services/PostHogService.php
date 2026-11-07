<?php

namespace App\Services;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PostHog\PostHog;
use Symfony\Component\HttpFoundation\Response;

class PostHogService
{
    private bool $configured = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! $apiKey || ! $host) {
            $this->warnAboutMissingConfiguration($apiKey, $host);

            return;
        }

        PostHog::init($apiKey, [
            'host' => $host,
            'error_tracking' => [
                'enabled' => true,
                'context_provider' => static function (array $payload): array {
                    return [
                        'distinctId' => auth()->id() !== null ? (string) auth()->id() : null,
                        'properties' => array_filter([
                            '$current_url' => request()->getPathInfo(),
                            '$request_method' => request()->method(),
                            '$exception_source' => $payload['source'] ?? null,
                        ]),
                    ];
                },
            ],
        ]);
        $this->configured = true;
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if (! $this->configured) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    public function identifyUser(User $user): void
    {
        $this->identify((string) $user->getAuthIdentifier(), [
            'email' => $user->email,
            'name' => $user->name,
        ]);
    }

    public function withRequestContext(Request $request, Closure $next): Response
    {
        if (! $this->configured) {
            return $next($request);
        }

        $context = PostHog::contextFromHeaders($request->headers->all());

        if (auth()->id() !== null) {
            $context['distinctId'] = (string) auth()->id();
        }

        return PostHog::withContext(
            $context,
            static fn (): Response => $next($request),
            ['fresh' => true],
        );
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if (! $this->configured) {
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
        if (! $this->configured) {
            return;
        }

        PostHog::captureException($exception, $distinctId, array_filter([
            '$current_url' => request()->getPathInfo(),
            '$request_method' => request()->method(),
        ]));
    }

    private function warnAboutMissingConfiguration(?string $apiKey, ?string $host): void
    {
        if (app()->environment('production')) {
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
