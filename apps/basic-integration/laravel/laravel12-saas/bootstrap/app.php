<?php

use App\Services\PostHogService;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            static fn ($request, $next) => app(PostHogService::class)->withRequestContext(
                $request,
                static fn () => $next($request),
            ),
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (\Throwable $exception): void {
            $distinctId = auth()->id();

            app(PostHogService::class)->captureException(
                $exception,
                $distinctId !== null ? (string) $distinctId : null,
            );
        });
    })->create();
