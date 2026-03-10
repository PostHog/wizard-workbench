<?php

namespace App\Http\Controllers;

use App\Actions\Billing\CheckoutPlan;
use App\Actions\Billing\GetSubscriptionSummary;
use App\Actions\Billing\RedirectToBillingPortal;
use App\Actions\Billing\SwapPlan;
use App\Domains\Billing\PlanCatalog;
use App\Services\PostHogService;
use Exception;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index(Request $request, PlanCatalog $catalog, GetSubscriptionSummary $summary)
    {
        $plans = $catalog->all();
        $data = $summary($request->user());

        return view('subscriptions.index', [
            'plans' => $plans,
            ...$data,
        ]);
    }

    public function checkout(Request $request, PlanCatalog $catalog, CheckoutPlan $checkoutPlan, PostHogService $posthog)
    {
        $plan = $catalog->findOrFail($request->plan);
        $user = $request->user();

        // PostHog: Track checkout initiation
        $posthog->capture($user->email, 'subscription_checkout_started', [
            'plan_name' => $plan->name,
            'plan_price' => $plan->price,
            'stripe_plan_id' => $plan->stripe_plan_id,
        ]);

        // Stub out subscription if Stripe isn't configured (for demo/development)
        if (!CheckoutPlan::isStripeConfigured()) {
            return $this->createStubSubscription($user, $plan);
        }

        $checkoutSession = $checkoutPlan($user, $plan);

        return redirect($checkoutSession->url);
    }

    /**
     * Create a stub subscription for demo/development when Stripe isn't configured.
     */
    protected function createStubSubscription($user, $plan)
    {
        // Cancel any existing subscriptions
        $user->subscriptions()->where('type', 'default')->update(['ends_at' => now()]);

        // Create a fake subscription
        $user->subscriptions()->create([
            'type' => 'default',
            'stripe_id' => 'sub_demo_' . uniqid(),
            'stripe_status' => 'active',
            'stripe_price' => $plan->stripe_plan_id ?? 'price_demo_' . uniqid(),
            'quantity' => 1,
            'trial_ends_at' => null,
            'ends_at' => null,
            'amount' => $plan->price ?? 0,
        ]);

        return redirect()->route('dashboard')->with('success', 'Demo subscription created for ' . $plan->name . '. (Stripe not configured)');
    }

    public function swap(Request $request, PlanCatalog $catalog, SwapPlan $swapPlan, PostHogService $posthog)
    {
        $plan = $catalog->findOrFail($request->plan);
        $user = $request->user();

        if ($user->subscribed('default')) {
            try {
                $swapPlan($user, $plan);

                // PostHog: Track successful plan swap
                $posthog->capture($user->email, 'subscription_plan_swapped', [
                    'new_plan_name' => $plan->name,
                    'new_plan_price' => $plan->price,
                    'stripe_plan_id' => $plan->stripe_plan_id,
                ]);

                return redirect()->route('subscribe')->with('success', 'Your subscription has been updated to '.$plan->name.'.');
            } catch (Exception $e) {
                $posthog->captureException($e, $user->email);

                return redirect()->route('subscribe')->with('error', 'There was an error updating your subscription: '.$e->getMessage());
            }
        }

        return redirect()->route('subscribe')->with('error', 'You don\'t have an active subscription.');
    }

    public function redirectToBillingPortal(Request $request, RedirectToBillingPortal $billingPortal, PostHogService $posthog)
    {
        $user = $request->user();

        // PostHog: Track billing portal access
        $posthog->capture($user->email, 'billing_portal_accessed');

        return $billingPortal($user);
    }
}
