# PostHog Revenue Analytics Setup Report

## Summary

This report documents the changes made to connect Stripe revenue data to PostHog for the stripe-next-js-saas-starter project.

## PostHog distinct_id

The project identifies users with `String(user.id)` — the user's numeric database ID as a string. This value is used consistently across all `posthog.identify()` and `posthog.capture()` calls in the codebase.

## Changes Made

### Modified Files

#### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` metadata to the `stripe.checkout.sessions.create` call inside `createCheckoutSession`:

1. **Session-level metadata** (`metadata` field): Associates the checkout session itself with the PostHog person.
2. **Subscription-level metadata** (`subscription_data.metadata` field): Propagates the distinct_id to the Stripe Subscription object that is automatically created when checkout completes.

```diff
     allow_promotion_codes: true,
+    metadata: { posthog_person_distinct_id: String(user.id) },
     subscription_data: {
       trial_period_days: 14,
+      metadata: { posthog_person_distinct_id: String(user.id) }
     }
```

The `user` object is already in scope at this call site (retrieved via `getUser()` earlier in the function), so no additional API calls or parameter threading was needed.

## What Was Not Changed

- **No `Customer.create` call exists** in this codebase. Stripe customers are created automatically by Stripe when a checkout session completes without an existing `customer` id. Adding metadata to auto-created customers would require a separate `customers.update` API call, which was intentionally avoided per the no-extra-API-calls constraint.
- `app/api/stripe/checkout/route.ts` — no Stripe object creation; only retrieves existing objects.
- `app/api/stripe/webhook/route.ts` — no Stripe object creation; only handles subscription change events.

## Manual Steps

1. **Connect PostHog Data Warehouse to Stripe**: In PostHog, go to **Data Warehouse** and add a Stripe source. PostHog will use the `posthog_person_distinct_id` metadata field to link Stripe customers and subscriptions to PostHog persons automatically.

2. **Verify metadata on new checkouts**: After deploying, complete a test checkout and confirm in the Stripe dashboard that the session and subscription both have `posthog_person_distinct_id` set in their metadata.

3. **Existing customers**: Existing Stripe customers created before this change will not have the metadata. To backfill them, you would need a one-time migration script that calls `stripe.customers.update` for each existing customer with their corresponding `posthog_person_distinct_id`.

4. **Deploy changes**: The modified file (`lib/payments/stripe.ts`) needs to be deployed for the metadata to start appearing in Stripe.
