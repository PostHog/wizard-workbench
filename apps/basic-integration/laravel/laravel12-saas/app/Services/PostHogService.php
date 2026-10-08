<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use PostHog\PostHog;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

class PostHogService
{
    private static bool $initialized = false;

    private bool $configured = false;

    public function __construct()
    {
        if ($this->isDisabled()) {
            return;
        }

        if (! $this->isConfigured('POSTHOG_PROJECT_TOKEN', config('posthog.api_key'))
            || ! $this->isConfigured('POSTHOG_HOST', config('posthog.host'))) {
            return;
        }

        if (! self::$initialized) {
            PostHog::init(config('posthog.api_key'), [
                'host' => config('posthog.host'),
                'debug' => config('posthog.debug'),
                'error_tracking' => [
                    'enabled' => true,
                    'context_provider' => static function (array $payload): array {
                        $userId = auth()->id();

                        return [
                            'distinctId' => $userId !== null ? (string) $userId : null,
                            'properties' => [],
                        ];
                    },
                ],
            ]);

            self::$initialized = true;
        }

        $this->configured = true;
    }

    public function capture(string $distinctId, string $event, array $properties = []): void
    {
        if ($this->isDisabled() || ! $this->configured) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public function identify(string $distinctId, array $properties = []): void
    {
        if ($this->isDisabled() || ! $this->configured) {
            return;
        }

        PostHog::identify([
            'distinctId' => $distinctId,
            'properties' => $properties,
        ]);
    }

    /**
     * @param  Closure(Request): Response  $next
     */
    public function withRequestContext(Request $request, Closure $next): Response
    {
        if ($this->isDisabled() || ! $this->configured) {
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

    public function captureException(\Throwable $exception, ?string $distinctId = null): void
    {
        if ($this->isDisabled() || ! $this->configured) {
            return;
        }

        PostHog::captureException($exception, $distinctId);
    }

    private function isDisabled(): bool
    {
        return (bool) config('posthog.disabled');
    }

    private function isConfigured(string $variable, mixed $value): bool
    {
        if (filled($value)) {
            return true;
        }

        if (config('posthog.debug')) {
            throw new RuntimeException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }

        return false;
    }
}
