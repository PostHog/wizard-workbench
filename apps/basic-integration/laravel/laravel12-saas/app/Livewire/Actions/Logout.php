<?php

namespace App\Livewire\Actions;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class Logout
{
    /**
     * Log the current user out of the application.
     */
    public function __invoke(): void
    {
        app(\App\Services\PostHogService::class)->capture('user_logged_out');

        Auth::guard('web')->logout();

        Session::invalidate();
        Session::regenerateToken();
    }
}
