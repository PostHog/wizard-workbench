<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Services\PostHogService;
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
            $properties = [];

            if (app()->bound('request')) {
                $request = request();
                $properties = array_filter([
                    '$current_url' => $request->fullUrl(),
                    '$request_method' => $request->method(),
                ], static fn ($value): bool => $value !== null && $value !== '');
            }

            app(PostHogService::class)->captureException(
                $exception,
                auth()->id() !== null ? (string) auth()->id() : null,
                $properties,
            );
        });
    })->create();
