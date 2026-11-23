<?php

namespace App\Actions\Billing;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use PostHog\Laravel\Facades\PostHog;

class RedirectToBillingPortal
{
    public function __invoke(User $user): RedirectResponse
    {
        // Redirect back with message if Stripe isn't configured (demo mode)
        if (!CheckoutPlan::isStripeConfigured()) {
            return redirect()->route('subscribe')->with('info', 'Billing portal is not available in demo mode (Stripe not configured).');
        }

        $redirect = $user->redirectToBillingPortal(route('dashboard'));

        PostHog::capture('billing_portal_opened');

        return $redirect;
    }
}
