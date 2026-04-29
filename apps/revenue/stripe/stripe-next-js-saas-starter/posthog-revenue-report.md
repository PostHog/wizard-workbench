# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard and `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog.

## PostHog distinct_id

The project uses `String(user.id)` (the user's numeric database ID converted to a string) as the PostHog distinct_id, confirmed from multiple `posthog.identify` and `posthog.capture` calls throughout the codebase.

## Changes Made

### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` to the `subscription_data.metadata` field in `createCheckoutSession`. This is the only Stripe object creation call in the project — the app uses Stripe Checkout in `subscription` mode, which auto-creates the Stripe Customer. The `user` variable is already in scope at this call site.

**Before:**
```typescript
subscription_data: {
  trial_period_days: 14
}
```

**After:**
```typescript
subscription_data: {
  trial_period_days: 14,
  metadata: {
    posthog_person_distinct_id: String(user.id)
  }
}
```

Note: `client_reference_id` was already set to `user.id.toString()` in the checkout session, which matches the PostHog distinct_id.

## Files Modified

| File | Change |
|------|--------|
| `lib/payments/stripe.ts` | Added `posthog_person_distinct_id` to `subscription_data.metadata` in `createCheckoutSession` |

## No Customer Creation Call

The project does not call `stripe.customers.create` directly — Stripe auto-creates the customer when the Checkout session completes. The `posthog_person_distinct_id` on the subscription metadata is sufficient for PostHog to resolve the customer connection.

## Manual Steps

No manual steps are required for new subscriptions created after this change.

For **existing customers** created before this change, PostHog will not yet have a `posthog_person_distinct_id` association. To backfill these, you can either:

1. Wait for those customers' next subscription renewal — if you add the metadata to subscription updates as well, PostHog will pick it up automatically.
2. Manually update existing Stripe subscriptions via the Stripe dashboard or a one-time script to add `posthog_person_distinct_id` to their metadata.

Once data flows, verify the connection in the [PostHog Top Customers dashboard](https://app.posthog.com/revenue_analytics#top-customers) and the `persons_revenue_analytics` table in the [data warehouse](https://app.posthog.com/data-warehouse).
