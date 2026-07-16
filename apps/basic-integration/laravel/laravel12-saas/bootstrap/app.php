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
            if (config('posthog.disabled') || ! config('posthog.api_key')) {
                return;
            }

            PostHog::captureException(
                $exception,
                auth()->id() !== null ? (string) auth()->id() : null,
                [
                    '$request_path' => request()->getPathInfo(),
                    '$request_method' => request()->method(),
                ],
            );
        });
    })->create();
