<?php

namespace App\Livewire;

use App\Services\PostHogService;
use Livewire\Component;

class Dashboard extends Component
{
    public function mount(PostHogService $posthog): void
    {
        $user = auth()->user();

        $posthog->identify($user->getPostHogDistinctId(), $user->getPostHogProperties());
        $posthog->capture($user->getPostHogDistinctId(), 'dashboard_viewed', [
            'has_active_subscription' => $user->subscribed('default'),
            'current_plan' => $user->subscription('default')?->stripe_price,
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
