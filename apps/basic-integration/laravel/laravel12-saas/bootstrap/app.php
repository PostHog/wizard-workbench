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
        $middleware->web(append: [function (Request $request, Closure $next) {
            $user = $request->user();

            return app(PostHogService::class)->withinRequestContext(
                $request,
                $user ? (string) $user->getAuthIdentifier() : null,
                fn () => $next($request),
            );
        }]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->reportable(function (\Throwable $exception) {
            app(\App\Services\PostHogService::class)->captureException(
                $exception,
                auth()->id() ? (string) auth()->id() : null,
            );
        });
    })->create();
