<?php

namespace App\Actions\Billing;

use App\Models\Plan;
use App\Models\User;

class SwapPlan
{
    public function __invoke(User $user, Plan $plan): void
    {
        $user->subscription('default')->swap($plan->stripe_plan_id);
    }
}
