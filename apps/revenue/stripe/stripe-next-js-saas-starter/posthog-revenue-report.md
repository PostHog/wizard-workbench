# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by embedding `posthog_person_distinct_id` metadata in the Stripe checkout session's subscription data. This enables the Top Customers dashboard and the `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog.

## Changes Made

### PostHog Distinct ID

The project uses `user.id.toString()` (the numeric database user ID as a string) as the PostHog distinct ID, consistent with all existing `posthog.identify()` and `posthog.capture()` calls throughout the codebase.

### Files Modified

#### `lib/payments/stripe.ts`

Added `posthog_person_distinct_id` to the `subscription_data.metadata` field inside the existing `stripe.checkout.sessions.create()` call in `createCheckoutSession`:

```typescript
subscription_data: {
  trial_period_days: 14,
  metadata: {
    posthog_person_distinct_id: user.id.toString()
  }
}
```

The `user` object is already in scope (retrieved via `getUser()` earlier in the function), and `client_reference_id` was already set to `user.id.toString()`. No new API calls were added; only the existing create call was modified.

### Files Created

- `posthog-revenue-report.md` — this report

## What Was Not Changed

- **No `stripe.customers.create()` calls exist** — this project relies on Stripe auto-creating customers during the checkout session. PostHog will resolve the `posthog_person_distinct_id` from the subscription metadata attached to any customer.
- **No direct `stripe.subscriptions.create()` / `stripe.paymentIntents.create()` calls exist** — subscriptions are created by Stripe as part of the checkout session flow.
- The webhook handler (`app/api/stripe/webhook/route.ts`) and checkout completion handler (`app/api/stripe/checkout/route.ts`) required no changes.

## Manual Steps

1. **Deploy the changes** — the metadata will only appear on subscriptions created after deployment. Existing subscriptions and customers will not be retroactively updated.

2. **Verify in Stripe** — after a test checkout, confirm that the new subscription object in the Stripe dashboard shows `posthog_person_distinct_id` under its metadata.

3. **Verify in PostHog** — after Stripe syncs data (via the PostHog Stripe data warehouse connector), check the [Top Customers dashboard](https://us.posthog.com/revenue_analytics#top-customers) and the `persons_revenue_analytics` table to confirm persons are being matched.

4. **Existing customers** — for customers created before this change, PostHog will pick up `posthog_person_distinct_id` from any new subscription renewal, upgrade, or invoice that includes the metadata. No manual backfill is required.
