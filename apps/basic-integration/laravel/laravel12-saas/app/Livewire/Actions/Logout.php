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
        $userId = (string) Auth::id();

        Auth::guard('web')->logout();

        if ($userId) {
            PostHogService::capture($userId, 'user_logged_out');
            PostHogService::shutdown();
        }

        Session::invalidate();
        Session::regenerateToken();
    }
}
