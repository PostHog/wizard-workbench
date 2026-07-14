<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use PostHog\PostHog;
use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $exception): void {
            if (! config('services.posthog.api_key')) {
                return;
            }

            PostHog::captureException(
                $exception,
                auth()->check() ? (string) auth()->id() : null,
                array_filter([
                    '$current_url' => request()->fullUrl(),
                    '$request_method' => request()->method(),
                ], static fn (mixed $value): bool => $value !== null && $value !== '')
            );
        });
    })->create();
