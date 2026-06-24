# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding the `posthog_person_distinct_id` metadata field to Stripe subscription objects created via Stripe Checkout. This enables the Top Customers dashboard, `persons_revenue_analytics`, and `groups_revenue_analytics` tables in PostHog.

## PostHog distinct_id

The project uses `String(user.id)` (the user's numeric database ID as a string) as the PostHog distinct_id, consistent with all `posthog.identify()` calls in the codebase.

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` to the `subscription_data.metadata` in `createCheckoutSession`. The `user` object was already in scope, and `client_reference_id` was already set to `user.id.toString()`.

```diff
     subscription_data: {
       trial_period_days: 14,
+      metadata: {
+        posthog_person_distinct_id: user.id.toString()
+      }
     }
```

### No New Files Created

No new files were added. Only the existing Stripe checkout session creation was modified.

## What Was Not Changed

- No direct `stripe.customers.create()` calls exist in this codebase — Stripe auto-creates customers during checkout.
- No `PaymentIntent.create`, `Subscription.create`, `Charge.create`, `Invoice.create`, `Refund.create`, or `Transfer.create` calls exist — all subscription billing flows through `checkout.sessions.create`.
- The webhook handler (`app/api/stripe/webhook/route.ts`) was not modified; it handles subscription lifecycle events and does not create new Stripe objects.

## Manual Steps

1. **Deploy the change** — the metadata will be attached to all new Stripe subscriptions created after deployment. Existing subscriptions will not be backfilled automatically.

2. **Verify in Stripe** — after a test checkout, open the subscription in the Stripe dashboard and confirm the metadata field `posthog_person_distinct_id` is present with the correct user ID.

3. **Verify in PostHog** — after revenue data syncs (PostHog polls Stripe periodically), check the [Top Customers dashboard](https://us.posthog.com/revenue_analytics#top-customers) and the `persons_revenue_analytics` table in the [data warehouse](https://us.posthog.com/data-warehouse) to confirm persons are being resolved correctly.

4. **Existing customers** — for customers created before this change, PostHog will resolve their identity from the `posthog_person_distinct_id` metadata on the subscription once their next renewal invoice is processed. No manual backfill is required for future renewals.
