<?php

use App\Services\PostHogService;
use Closure;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            function (Request $request, Closure $next): Response {
                $user = $request->user();
                $distinctId = $user?->getAuthIdentifier();

                return app(PostHogService::class)->withRequestContext(
                    $request->headers->all(),
                    $distinctId !== null ? (string) $distinctId : null,
                    fn (): Response => $next($request),
                );
            },
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $exception): void {
            app(PostHogService::class)->captureException($exception);
        });
    })->create();
