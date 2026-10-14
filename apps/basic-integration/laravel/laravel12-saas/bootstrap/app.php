<?php

use App\Services\PostHogService;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use PostHog\PostHog;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

final class PostHogRequestContext
{
    public function handle(\Illuminate\Http\Request $request, \Closure $next): Response
    {
        $posthog = app(PostHogService::class);

        if (! $posthog->isEnabled()) {
            return $next($request);
        }

        $context = PostHog::contextFromHeaders($request->headers->all());

        if ($user = $request->user()) {
            $context['distinctId'] = (string) $user->getAuthIdentifier();
        }

        return PostHog::withContext(
            $context,
            static fn (): Response => $next($request),
            ['fresh' => true],
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
        $middleware->appendToGroup('web', PostHogRequestContext::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $exception): void {
            $distinctId = auth()->id();

            app(PostHogService::class)->captureException(
                $exception,
                $distinctId !== null ? (string) $distinctId : null,
            );
        });
    })->create();
