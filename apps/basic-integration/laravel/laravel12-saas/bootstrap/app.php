<?php

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
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (\Throwable $e) {
            if (! config('posthog.api_key')) {
                return;
            }
            $posthog = app(\App\Services\PostHogService::class);
            $distinctId = auth()->user()?->email ?? 'anonymous';
            $posthog->captureException($e, $distinctId);
        });
    })->create();
