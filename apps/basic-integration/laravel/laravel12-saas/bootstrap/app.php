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
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->report(function (Throwable $exception): void {
            $userId = auth()->id();

            if ($userId === null) {
                return;
            }

            app(PostHogService::class)->captureException($exception, (string) $userId, [
                '$current_url' => request()->fullUrl(),
                '$request_method' => request()->method(),
            ]);
        });
    })->create();
