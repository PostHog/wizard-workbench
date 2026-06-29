# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard and `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog.

## PostHog distinct_id

The project identifies users with `String(user.id)` — the user's numeric database ID converted to a string, consistent across both server-side (`app/(login)/actions.ts`) and client-side (`app/(dashboard)/layout.tsx`) PostHog calls.

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` to `subscription_data.metadata` in the `createCheckoutSession` function. The value `user.id.toString()` is already in scope (fetched via `getUser()` earlier in the function) and matches the PostHog distinct_id used throughout the app.

```diff
  subscription_data: {
    trial_period_days: 14,
+   metadata: {
+     posthog_person_distinct_id: user.id.toString()
+   }
  }
```

`client_reference_id` was already set to `user.id.toString()` — no change needed there.

## What Was Not Changed

- No `stripe.customers.create` calls exist in this codebase.
- No `stripe.subscriptions.create`, `stripe.paymentIntents.create`, or `stripe.charges.create` calls exist (Stripe manages subscription creation automatically via the checkout session).
- The webhook handler (`app/api/stripe/webhook/route.ts`) handles `customer.subscription.updated` / `customer.subscription.deleted` but does not create new Stripe objects, so no metadata changes were needed there.

## Manual Steps

1. **Deploy the change** — the metadata will be attached to new subscriptions created after deployment. Existing subscriptions will not be retroactively updated.
2. **Verify in Stripe** — after a test checkout, open the subscription in the Stripe dashboard and confirm the metadata key `posthog_person_distinct_id` is present with the correct user ID.
3. **Verify in PostHog** — after a test checkout, check the [Revenue Analytics dashboard](https://us.posthog.com/revenue_analytics) and confirm the customer appears linked to their person profile.
4. **Existing customers** — if you have customers created before this change, PostHog will pick up `posthog_person_distinct_id` from any new subscription or renewal events going forward. No manual backfill is required.
