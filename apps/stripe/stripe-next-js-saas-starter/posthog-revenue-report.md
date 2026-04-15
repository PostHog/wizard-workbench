# PostHog Revenue Analytics Setup Report

## Summary

PostHog revenue analytics has been connected to this project's Stripe integration by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard and `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog.

## PostHog distinct_id

The project identifies users with `String(user.id)` — the user's database integer ID converted to a string. This value is used consistently across all PostHog `identify` and `capture` calls in the codebase.

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` to `subscription_data.metadata` inside the `createCheckoutSession` function. The project uses Stripe Checkout in subscription mode, so this is the correct location per the Stripe Checkout special case in the skill documentation.

```ts
subscription_data: {
  trial_period_days: 14,
  metadata: {
    posthog_person_distinct_id: String(user.id)
  }
}
```

The `client_reference_id` was already set to `user.id.toString()` (which equals the PostHog distinct_id), so no change was needed there.

No new files were created. No new Stripe API calls were added.

## How It Works

When a user completes checkout:
1. Stripe creates a subscription with `posthog_person_distinct_id` in its metadata.
2. PostHog reads this metadata from the subscription object and links revenue data to the corresponding person profile.
3. The Top Customers dashboard and revenue analytics tables become populated with per-user revenue.

## Manual Steps

No manual steps are required in the codebase. However, to fully activate revenue analytics in PostHog:

1. **Connect Stripe as a data source** in PostHog under *Data pipelines* > *Sources* > *Stripe*, if not already done.
2. **Verify** that new checkouts after this deployment show `posthog_person_distinct_id` in the Stripe subscription metadata (visible in the Stripe Dashboard under the subscription's metadata section).
3. **Existing customers** created before this change will be linked automatically once they generate a new subscription event (renewal, upgrade, etc.) that carries the metadata. No backfill of old customer objects is needed.
