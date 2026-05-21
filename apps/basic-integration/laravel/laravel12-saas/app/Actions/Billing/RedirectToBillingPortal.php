<?php

namespace App\Actions\Billing;

use App\Models\User;
use App\Services\PostHogService;
use Illuminate\Http\RedirectResponse;

class RedirectToBillingPortal
{
    public function __invoke(User $user): RedirectResponse
    {
        // Redirect back with message if Stripe isn't configured (demo mode)
        if (!CheckoutPlan::isStripeConfigured()) {
            return redirect()->route('subscribe')->with('info', 'Billing portal is not available in demo mode (Stripe not configured).');
        }

        app(PostHogService::class)->capture((string) $user->id, 'billing_portal_accessed');

        return $user->redirectToBillingPortal(route('dashboard'));
    }
}
