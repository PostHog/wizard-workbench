<?php

namespace App\Livewire;

use App\Services\PostHogService;
use Livewire\Component;

class Dashboard extends Component
{
    public function mount(PostHogService $posthog): void
    {
        $user = auth()->user();

        // PostHog: Track dashboard view
        $posthog->capture($user->email, 'dashboard_viewed', [
            'subscribed' => $user->subscribed('default'),
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
