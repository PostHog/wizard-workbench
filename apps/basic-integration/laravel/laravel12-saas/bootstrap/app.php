<?php

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
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $e) {
            try {
                $distinctId = app()->bound('auth') && auth()->id() ? (string) auth()->id() : 'anonymous';
                PostHog::capture([
                    'distinctId' => $distinctId,
                    'event' => '$exception',
                    'properties' => [
                        '$exception_type' => get_class($e),
                        '$exception_message' => $e->getMessage(),
                        '$exception_stack_trace_raw' => $e->getTraceAsString(),
                    ],
                ]);
            } catch (\Throwable) {
                // PostHog not yet initialized or auth not available
            }
        });
    })->create();
