<?php

namespace App\Actions\Billing;

use App\Models\Plan;
use App\Models\User;
use Laravel\Cashier\Checkout;

class CheckoutPlan
{
    /**
     * Check if Stripe is properly configured.
     */
    public static function isStripeConfigured(): bool
    {
        $key = config('cashier.secret');

        return ! empty($key) && $key !== 'sk_test_xxx' && ! str_starts_with($key, 'your_');
    }

    public function __invoke(User $user, Plan $plan): Checkout
    {
        if (! self::isStripeConfigured()) {
            throw new \RuntimeException('Stripe is not configured. Please set STRIPE_SECRET in your .env file.');
        }

        return $user->newSubscription('default', $plan->stripe_plan_id)->checkout([
            'success_url' => route('dashboard'),
            'cancel_url' => route('subscribe'),
            'allow_promotion_codes' => true,
        ]);
    }
}
