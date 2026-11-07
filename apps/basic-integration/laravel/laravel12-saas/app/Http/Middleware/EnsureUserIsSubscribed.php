<?php

namespace App\Http\Middleware;

use App\Services\PostHogService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsSubscribed
{
    public function __construct(private PostHogService $posthog) {}

    /**
     * @param  Closure(Request):Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() !== null && ! $request->user()->subscribed('default')) {
            return redirect()->route('subscribe');
        }

        return $this->posthog->withRequestContext($request, $next);
    }
}
