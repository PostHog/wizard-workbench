<?php

namespace App\Livewire;

use App\Services\PostHogService;
use Livewire\Component;

class Dashboard extends Component
{
    public function mount(PostHogService $posthog): void
    {
        $user = auth()->user();

        $posthog->capture($user->posthogDistinctId(), 'dashboard_viewed', [
            'has_active_subscription' => $user->subscribed('default'),
            'has_verified_email' => $user->hasVerifiedEmail(),
        ]);
    }

    public function render()
    {
        $user = auth()->user();

        return view('livewire.dashboard', [
            'subscribed' => $user->subscribed('default'),
            'plan' => $user->subscription('default')->stripe_plan ?? null,
        ]);
    }
}
