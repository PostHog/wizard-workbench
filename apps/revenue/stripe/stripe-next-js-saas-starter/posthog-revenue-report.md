# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard and the `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog.

## PostHog Distinct ID

The project uses `String(user.id)` (the database user ID as a string) as the PostHog distinct_id, consistent with all `posthog.identify` and `posthog.capture` calls throughout the codebase.

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` to `subscription_data.metadata` in the `createCheckoutSession` function. This is the only Stripe object creation call in the codebase — the app uses Stripe Checkout in subscription mode, which automatically creates a customer and subscription.

```typescript
subscription_data: {
  trial_period_days: 14,
  metadata: {
    posthog_person_distinct_id: String(user.id)
  }
}
```

The `client_reference_id` was already set to `user.id.toString()` prior to this change, which is correct.

## No New Files Created

No new files were created. The change is limited to adding the metadata field.

## Manual Steps

1. **Deploy the changes** — the metadata will be attached to all new Stripe subscriptions created after deployment.

2. **Backfill existing customers** — for customers who subscribed before this change, PostHog will not yet have a `posthog_person_distinct_id` link. To backfill, you can manually update existing Stripe subscriptions or invoices with the metadata via the Stripe Dashboard or API.

3. **Connect Stripe in PostHog** — ensure your Stripe account is connected to your PostHog project at [https://us.posthog.com/settings/project-revenue-analytics](https://us.posthog.com/settings/project-revenue-analytics) so PostHog can read the metadata and populate the revenue tables.

4. **Wait for data** — after connecting, PostHog will sync revenue data and populate the `persons_revenue_analytics` table. This may take a short time depending on your data volume.
