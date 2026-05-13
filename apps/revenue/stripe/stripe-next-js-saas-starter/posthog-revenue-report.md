# PostHog Revenue Analytics Setup Report

## Summary

This project uses Stripe Checkout (subscription mode) to handle all payments. Subscriptions are created entirely through Stripe Checkout sessions — there are no direct `customers.create`, `subscriptions.create`, or `paymentIntents.create` calls in the codebase.

The PostHog distinct_id used throughout this project is `String(user.id)` (the user's numeric database ID cast to a string), as confirmed by multiple `posthog.identify` and `posthog.capture` calls in `app/(login)/actions.ts` and other files.

## Changes Made

### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` metadata to the `subscription_data` of the Stripe Checkout session in `createCheckoutSession`. This tags every new subscription created through checkout with the PostHog person distinct_id, enabling PostHog to connect revenue data to the correct person profile.

```diff
     subscription_data: {
       trial_period_days: 14,
+      metadata: { posthog_person_distinct_id: String(user.id) }
     }
```

The `client_reference_id` was already set to `user.id.toString()` in this function, which is consistent with the distinct_id used across the app.

## Files Modified

| File | Change |
|------|--------|
| `lib/payments/stripe.ts` | Added `posthog_person_distinct_id` to `subscription_data.metadata` in `createCheckoutSession` |

## Files Created

| File | Description |
|------|-------------|
| `posthog-revenue-report.md` | This report |

## Manual Steps

1. **Deploy the change** — the metadata will be included on all new Stripe Checkout sessions going forward. Existing subscriptions created before this change will not have the metadata automatically.

2. **Connect Stripe as a data source in PostHog** — if you haven't already, go to PostHog > Data warehouse > Stripe and connect your Stripe account so PostHog can import revenue data.

3. **Backfill existing customers (optional)** — for customers created before this change, PostHog will automatically pick up `posthog_person_distinct_id` from the most recently created child object (subscription, charge, or invoice). No action needed if you have existing subscriptions — they will be tagged on the next renewal once the new code is deployed.

4. **Verify in PostHog** — after the next subscription is created, check the Top Customers dashboard in PostHog Revenue Analytics to confirm the connection is working.
