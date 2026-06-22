# PostHog Revenue Analytics Setup Report

## What was done

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to the Stripe subscription created during checkout. This enables the Top Customers dashboard and the `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog.

**PostHog distinct_id used:** `String(user.id)` — the numeric database user ID, consistent with all existing `posthog.identify()` calls in the project.

## Files modified

### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` to `subscription_data.metadata` in the `createCheckoutSession` function:

```typescript
subscription_data: {
  trial_period_days: 14,
  metadata: {
    posthog_person_distinct_id: user.id.toString()
  }
}
```

The `client_reference_id` was already set to `user.id.toString()` — the new metadata uses the same value, which matches the distinct_id used in all PostHog identify and capture calls throughout the app.

## Files created

- `posthog-revenue-report.md` (this file)

## How it works

When a user subscribes, Stripe creates a subscription with `posthog_person_distinct_id` in its metadata. PostHog reads this field from subscriptions, charges, and invoices to link Stripe revenue back to the correct PostHog person profile.

## Manual steps

1. **Deploy the change** — the metadata is only attached to new subscriptions going forward. Existing subscriptions will not be backfilled automatically.
2. **Verify in PostHog** — after the next successful subscription checkout, check the [Revenue Analytics dashboard](https://us.posthog.com/revenue_analytics) and confirm customers appear under Top Customers.
3. **Connect Stripe as a data source** (if not already done) — in PostHog, go to **Data warehouse → Sources** and add your Stripe account so PostHog can sync your Stripe data.
