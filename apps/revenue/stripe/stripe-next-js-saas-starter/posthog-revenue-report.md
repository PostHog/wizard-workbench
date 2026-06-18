# PostHog Revenue Analytics Setup Report

## Summary

This project uses Stripe Checkout in subscription mode. Revenue analytics was connected to PostHog by adding `posthog_person_distinct_id` to the Stripe subscription metadata at checkout session creation time.

The PostHog distinct_id in this project is `String(user.id)` — the user's numeric database ID converted to a string, consistent with all `posthog.identify()` and `posthog.capture()` calls throughout the codebase.

## Changes Made

### Files Modified

**`lib/payments/stripe.ts`**

Added `metadata.posthog_person_distinct_id` to the `subscription_data` block inside `createCheckoutSession()`. The `user` variable is already in scope at this call site, so `user.id.toString()` is used directly — no new API calls or parameter threading required.

```diff
     subscription_data: {
       trial_period_days: 14,
+      metadata: {
+        posthog_person_distinct_id: user.id.toString()
+      }
     }
```

Note: This project has no direct `stripe.customers.create()` calls. Stripe auto-creates customers when the checkout session completes. The `client_reference_id` was already set to `user.id.toString()` in the same call, confirming the correct distinct_id was used.

## No Placeholders

All changes use the real distinct_id value (`user.id.toString()`), which is directly available in scope. No `TODO_POSTHOG_DISTINCT_ID` placeholders were needed.

## Manual Steps

1. **Connect your Stripe account to PostHog** — go to [PostHog Data Warehouse](https://us.posthog.com/project/2/data-warehouse) and add your Stripe source if you haven't already.

2. **Deploy the changes** — the `posthog_person_distinct_id` metadata will be written to new Stripe subscriptions after deployment. Existing subscriptions created before this change will not have the metadata on the subscription object itself, but PostHog will automatically resolve it from future child objects (charges, invoices) once they are tagged.

3. **Verify in Stripe** — after a test checkout, open the subscription in the Stripe dashboard and confirm `posthog_person_distinct_id` appears in the metadata tab.

4. **Check PostHog** — once the Stripe source is synced, query the `persons_revenue_analytics` table in the PostHog SQL editor to confirm revenue is being linked to person profiles.
