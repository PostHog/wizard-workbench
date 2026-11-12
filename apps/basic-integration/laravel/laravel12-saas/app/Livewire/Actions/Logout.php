<?php

namespace App\Livewire\Actions;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use PostHog\Laravel\Facades\PostHog;

class Logout
{
    /**
     * Log the current user out of the application.
     */
    public function __invoke(): void
    {
        PostHog::capture('user_logged_out');

        Auth::guard('web')->logout();

        Session::invalidate();
        Session::regenerateToken();
    }
}
