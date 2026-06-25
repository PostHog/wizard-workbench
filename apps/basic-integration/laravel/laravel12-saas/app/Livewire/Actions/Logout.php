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
    public function __invoke(PostHogService $posthog): void
    {
        $user = Auth::user();
        if ($user) {
            $posthog->capture((string) $user->id, 'user_logged_out', [
                'email' => $user->email,
            ]);
        }

        Auth::guard('web')->logout();

        Session::invalidate();
        Session::regenerateToken();
    }
}
