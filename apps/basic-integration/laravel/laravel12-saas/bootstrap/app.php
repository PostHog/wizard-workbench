<?php

use App\Services\PostHogService;
use Closure;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
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
            static fn (Request $request, Closure $next) => app(PostHogService::class)->withRequestContext($request, $next),
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (\Throwable $exception): void {
            try {
                app(PostHogService::class)->captureException(
                    $exception,
                    auth()->id() !== null ? (string) auth()->id() : null,
                    [
                        '$request_method' => request()->method(),
                        '$request_path' => request()->path(),
                    ],
                );
            } catch (\Throwable) {
                // Analytics must never interrupt Laravel's normal exception reporting.
            }
        });
    })->create();
