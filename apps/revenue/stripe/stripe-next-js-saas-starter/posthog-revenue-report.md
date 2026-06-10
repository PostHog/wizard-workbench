# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe Checkout sessions. This enables PostHog to link Stripe subscriptions and revenue back to individual users in the `persons_revenue_analytics` and `groups_revenue_analytics` tables.

## PostHog distinct_id

The project identifies users in PostHog using `String(user.id)` (the numeric database user ID cast to string). This value is used consistently across all `posthog.identify()` and `posthog.capture()` calls throughout the codebase.

## Changes Made

### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` to `subscription_data.metadata` inside the `createCheckoutSession` function's `stripe.checkout.sessions.create()` call.

**Before:**
```ts
subscription_data: {
  trial_period_days: 14
}
```

**After:**
```ts
subscription_data: {
  trial_period_days: 14,
  metadata: {
    posthog_person_distinct_id: String(user.id)
  }
}
```

The `client_reference_id` field was already set to `user.id.toString()` — no change needed there.

## Files Modified

| File | Change |
|------|--------|
| `lib/payments/stripe.ts` | Added `posthog_person_distinct_id` to `subscription_data.metadata` in `createCheckoutSession` |

## Files Created

| File | Description |
|------|-------------|
| `posthog-revenue-report.md` | This report |

## Notes

- No Stripe `customers.create`, `subscriptions.create`, or `paymentIntents.create` calls exist in the codebase — Stripe manages customer and subscription creation automatically through Checkout Sessions.
- The webhook handler (`app/api/stripe/webhook/route.ts`) only handles `customer.subscription.updated` / `customer.subscription.deleted` events and does not create any Stripe objects, so no changes were needed there.

## Manual Steps

1. **Deploy the change** — the metadata will be attached to all new Stripe subscriptions created after deployment.
2. **Verify in PostHog** — after a test checkout, open the [PostHog Revenue Analytics dashboard](https://us.posthog.com/project/2/revenue_analytics) and confirm the subscription appears linked to the correct person.
3. **Existing customers** — subscriptions created before this change will not have the metadata. PostHog resolves `posthog_person_distinct_id` from the most recently created child object (subscription, charge, or invoice), so existing customers will be linked once they next renew or create a new subscription.
