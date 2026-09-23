<?php

use App\Services\PostHogService;
use Closure;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->appendToGroup('web', function (Request $request, Closure $next): Response {
            return app(PostHogService::class)->withRequestContext($request, $next);
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $exception): void {
            app(PostHogService::class)->captureException(
                $exception,
                auth()->id() !== null ? (string) auth()->id() : null,
                [
                    '$current_url' => request()->url(),
                    '$request_method' => request()->method(),
                ]
            );
        });
    })->create();
