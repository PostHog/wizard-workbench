<?php

use App\Http\Middleware\PostHogRequestContext;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use PostHog\PostHog;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [PostHogRequestContext::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $e): void {
            if (! config('posthog.api_key')) {
                return;
            }
            PostHog::captureException(
                $e,
                auth()->id() !== null ? (string) auth()->id() : null,
                [
                    '$current_url' => request()->fullUrl(),
                    '$request_method' => request()->method(),
                ]
            );
        });
    })->create();
