<?php

use App\Services\PostHogService;
use Closure;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use PostHog\PostHog;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

final class PostHogRequestContext
{
    /**
     * Bind PostHog identity to the request so events and reported exceptions inherit it.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $posthog = app(PostHogService::class);

        if ($posthog->isDisabled()) {
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
            ['fresh' => true]
        );
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(PostHogRequestContext::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->report(function (Throwable $exception): void {
            $posthog = app(PostHogService::class);

            if ($posthog->isDisabled()) {
                return;
            }

            $request = request();

            $posthog->captureException(
                $exception,
                auth()->id() !== null ? (string) auth()->id() : null,
                array_filter([
                    '$request_method' => $request->method(),
                    '$request_path' => $request->getPathInfo(),
                ], static fn ($value): bool => $value !== null && $value !== '')
            );
        });
    })->create();
