<?php

namespace App\Domains\Billing;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Collection;

class PlanCatalog
{
    public function all(): Collection
    {
        return Plan::query()->orderBy('price')->get();
    }

    public function findOrFail(int|string $id): Plan
    {
        return Plan::query()->findOrFail($id);
    }

    public function findByStripePrice(?string $priceId): ?Plan
    {
        if (! $priceId) {
            return null;
        }

        return Plan::query()->where('stripe_plan_id', $priceId)->first();
    }
}
