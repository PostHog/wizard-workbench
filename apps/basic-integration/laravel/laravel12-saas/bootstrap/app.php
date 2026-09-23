<?php

use App\Services\PostHogService;
use Closure;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->appendToGroup('web', [
            function (Request $request, Closure $next) {
                return app(PostHogService::class)->withRequestContext($request, $next);
            },
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->report(function (\Throwable $exception): void {
            $distinctId = auth()->id();

            app(PostHogService::class)->captureException(
                $exception,
                $distinctId !== null ? (string) $distinctId : null,
            );
        });
    })->create();
