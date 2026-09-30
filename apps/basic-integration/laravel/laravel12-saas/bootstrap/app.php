<?php

use App\Services\PostHogService;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            function (\Illuminate\Http\Request $request, \Closure $next): mixed {
                $user = $request->user();

                return app(PostHogService::class)->withRequestContext(
                    $request->headers->all(),
                    $user ? (string) $user->getAuthIdentifier() : null,
                    fn (): mixed => $next($request),
                );
            },
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $exception): void {
            app(PostHogService::class)->captureException(
                $exception,
                auth()->id() !== null ? (string) auth()->id() : null,
            );
        });
    })->create();
