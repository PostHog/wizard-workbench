# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to the Stripe Checkout session's subscription data. This enables the Top Customers dashboard and `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog.

## Changes Made

### Files Modified

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` to `subscription_data.metadata` in the `createCheckoutSession` function. The value is `user.id.toString()`, which matches the `distinctId` used throughout the app's PostHog capture calls.

```diff
  subscription_data: {
    trial_period_days: 14,
+   metadata: {
+     posthog_person_distinct_id: user.id.toString()
+   }
  }
```

The `client_reference_id` was already set to `user.id.toString()` in the same function, which is consistent with the PostHog distinct_id.

### Why this location

The app uses Stripe Checkout in `subscription` mode — there are no direct `stripe.customers.create`, `stripe.subscriptions.create`, or `stripe.paymentIntents.create` calls. Stripe automatically creates the customer and subscription during checkout. Adding the metadata to `subscription_data` ensures PostHog can resolve the person from the subscription object tied to each customer.

## No New Files Created

No new files were created. No new packages or dependencies were added.

## Manual Steps

No manual steps are required for the code change itself. However, to fully activate revenue analytics in PostHog:

1. **Connect Stripe as a data source in PostHog**: Go to [Data Warehouse](https://us.posthog.com/project/483112/data-warehouse) and add your Stripe account as a source. PostHog will sync revenue data and use the `posthog_person_distinct_id` metadata to link charges, subscriptions, and invoices to person profiles.

2. **Existing customers**: For Stripe customers created before this change, their old subscriptions won't have the metadata. Future subscription renewals and new subscriptions will automatically carry the metadata. No backfill is required — PostHog resolves the identity from the most recently created child object (charge/invoice).

3. **Deploy the change**: The metadata is only attached at checkout session creation time, so the change takes effect for all new subscriptions after deployment.
