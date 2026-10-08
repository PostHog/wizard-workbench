<?php

namespace App\Http\Middleware;

use App\Services\PostHogService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class PostHogRequestContext
{
    public function __construct(private readonly PostHogService $posthog) {}

    /**
     * Bind the authenticated user to all PostHog activity for this request.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $this->posthog->withRequestContext($request, $next);
    }
}

class EnsureUserIsSubscribed
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request):Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->user() && ! auth()->user()->subscribed('default')) {
            return redirect()->route('subscribe');
        }

        return $next($request);
    }
}
