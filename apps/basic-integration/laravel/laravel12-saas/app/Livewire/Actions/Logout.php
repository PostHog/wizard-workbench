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
    public function __invoke(bool $captureEvent = true): void
    {
        if ($captureEvent) {
            app(PostHogService::class)->capture('user_logged_out');
        }

        Auth::guard('web')->logout();

        Session::invalidate();
        Session::regenerateToken();
    }
}
