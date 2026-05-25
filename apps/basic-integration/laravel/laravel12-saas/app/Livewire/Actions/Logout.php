<?php

namespace App\Livewire\Actions;

use App\Services\PostHogService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class Logout
{
    public function __construct(private PostHogService $posthog) {}

    /**
     * Log the current user out of the application.
     */
    public function __invoke(): void
    {
        $user = Auth::user();
        if ($user) {
            $this->posthog->capture($user->email, 'user_logged_out');
        }

        Auth::guard('web')->logout();

        Session::invalidate();
        Session::regenerateToken();
    }
}
