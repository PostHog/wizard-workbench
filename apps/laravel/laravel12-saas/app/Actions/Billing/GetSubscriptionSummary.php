<?php

namespace App\Actions\Billing;

use App\Domains\Billing\PlanCatalog;
use App\Models\User;

class GetSubscriptionSummary
{
    public function __construct(private PlanCatalog $catalog) {}

    public function __invoke(User $user): array
    {
        $hasActiveSubscription = $user->subscribed('default');
        $currentPriceId = null;
        $currentPlanPrice = null;

        if ($hasActiveSubscription) {
            $currentPriceId = $user->subscription('default')->stripe_price;
            $currentPlanPrice = $this->catalog->findByStripePrice($currentPriceId)?->price;
        }

        return [
            'hasActiveSubscription' => $hasActiveSubscription,
            'currentPlan' => $currentPriceId,
            'currentPlanPrice' => $currentPlanPrice,
        ];
    }
}
