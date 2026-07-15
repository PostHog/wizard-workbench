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
        $distinctId = $user->getPostHogDistinctId();
        $posthog->identify($distinctId, $user->getPostHogProperties());
        $posthog->capture($distinctId, 'subscription_checkout_started', [
            'plan' => $plan->slug,
            'price' => $plan->price,
        ]);

        // Stub out subscription if Stripe isn't configured (for demo/development)
        if (!CheckoutPlan::isStripeConfigured()) {
            return $this->createStubSubscription($user, $plan, $posthog);
        }

        $checkoutSession = $checkoutPlan($user, $plan);

        $posthog->capture($distinctId, 'subscription_created', [
            'plan' => $plan->slug,
            'billing_provider' => 'stripe',
        ]);

        return redirect($checkoutSession->url);
    }

    /**
     * Create a stub subscription for demo/development when Stripe isn't configured.
     */
    protected function createStubSubscription($user, $plan, PostHogService $posthog)
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

        $posthog->capture($user->getPostHogDistinctId(), 'subscription_created', [
            'plan' => $plan->slug,
            'billing_provider' => 'demo',
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

                $posthog->capture($user->getPostHogDistinctId(), 'subscription_plan_changed', [
                    'plan' => $plan->slug,
                    'price' => $plan->price,
                ]);

                return redirect()->route('subscribe')->with('success', 'Your subscription has been updated to '.$plan->name.'.');
            } catch (Exception $e) {
                return redirect()->route('subscribe')->with('error', 'There was an error updating your subscription: '.$e->getMessage());
            }
        }

        return redirect()->route('subscribe')->with('error', 'You don\'t have an active subscription.');
    }

    public function redirectToBillingPortal(Request $request, RedirectToBillingPortal $billingPortal, PostHogService $posthog)
    {
        $user = $request->user();
        $posthog->capture($user->getPostHogDistinctId(), 'billing_portal_opened');

        return $billingPortal($user);
    }
}
