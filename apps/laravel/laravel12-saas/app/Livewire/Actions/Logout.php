<?php

namespace App\Livewire\Actions;

use App\Services\PostHogService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class Logout
{
    /**
     * Log the current user out of the application.
     */
    public function __invoke(): void
    {
        // PostHog: Track logout before session is destroyed
        $user = Auth::user();
        if ($user) {
            $posthog = app(PostHogService::class);
            $posthog->capture($user->email, 'user_logged_out');
        }

        Auth::guard('web')->logout();

        Session::invalidate();
        Session::regenerateToken();
    }
}
