<?php

use App\Services\PostHogService;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

require_once __DIR__.'/../app/Http/Middleware/EnsureUserIsSubscribed.php';

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->appendToGroup('web', \App\Http\Middleware\PostHogRequestContext::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $exception): void {
            $userId = auth()->id();

            app(PostHogService::class)->captureException(
                $exception,
                $userId !== null ? (string) $userId : null,
            );
        });
    })->create();
