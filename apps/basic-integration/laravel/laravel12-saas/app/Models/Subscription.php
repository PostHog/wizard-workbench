<?php

namespace App\Models;

use App\Actions\Billing\CheckoutPlan;
use Laravel\Cashier\Subscription as CashierSubscription;

class Subscription extends CashierSubscription
{
    protected static function booted()
    {
        static::creating(function ($subscription) {
            // Skip Stripe API call if not configured (demo mode)
            if (CheckoutPlan::isStripeConfigured() && ! str_starts_with($subscription->stripe_id, 'sub_demo_')) {
                $subscription->updateAmount();
            }
        });

        static::updating(function ($subscription) {
            // Skip Stripe API call if not configured (demo mode)
            if (CheckoutPlan::isStripeConfigured() && ! str_starts_with($subscription->stripe_id, 'sub_demo_')) {
                $subscription->updateAmount();
            }
        });
    }

    public function updateAmount()
    {
        $stripeSubscription = $this->asStripeSubscription();
        $this->amount = $stripeSubscription->items->data[0]->price->unit_amount / 100;
    }

    public static function createOrUpdate($subscription, $name, $plan)
    {
        $sub = parent::createOrUpdate($subscription, $name, $plan);

        // Skip Stripe API call if not configured (demo mode)
        if (CheckoutPlan::isStripeConfigured()) {
            $sub->updateAmount();
        }

        return $sub;
    }
}
