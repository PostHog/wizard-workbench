# PostHog Revenue Analytics Setup Report

## Summary

This project was configured to send `posthog_person_distinct_id` metadata on Stripe objects, enabling PostHog's revenue analytics features: the Top Customers dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table.

## PostHog distinct_id

The project uses `String(user.id)` (the user's database integer ID as a string) as the PostHog distinct_id. This was confirmed from:
- `app/(dashboard)/layout.tsx:27` — `posthog.identify(String(userData.id), ...)`
- `app/(login)/actions.ts:97,105` — `distinctId: String(foundUser.id)`

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` metadata to the Stripe Checkout Session creation in `createCheckoutSession`:

1. **Session-level metadata** — added to the top-level `metadata` field of the checkout session.
2. **Subscription metadata** — added to `subscription_data.metadata` so the subscription object itself carries the distinct_id.

The `client_reference_id` was already set to `user.id.toString()` (the PostHog distinct_id), so no change was needed there.

```diff
     client_reference_id: user.id.toString(),
     allow_promotion_codes: true,
+    metadata: { posthog_person_distinct_id: user.id.toString() },
     subscription_data: {
       trial_period_days: 14,
+      metadata: { posthog_person_distinct_id: user.id.toString() }
     }
```

## Files Created

- `posthog-revenue-report.md` (this file)

## No Changes Needed

- No direct `stripe.customers.create` calls exist in this codebase. Stripe auto-creates customers during checkout. The customer will be linked to PostHog via the subscription metadata added above.
- No new packages or dependencies were added.
- No existing logic was modified.

## Manual Steps

1. **Deploy the changes** — the metadata will only be attached to new checkout sessions created after deployment. Existing customers are not retroactively updated.

2. **Backfill existing customers (optional)** — for customers created before this change, PostHog will resolve `posthog_person_distinct_id` from the most recently created subscription or charge tied to that customer. Once those customers renew or create a new subscription, the metadata will be present automatically.

3. **Connect Stripe as a data source in PostHog** — if not already done, go to PostHog > Data pipeline > Sources and connect your Stripe account to enable revenue analytics.

4. **Verify in PostHog** — after a test checkout, check the Top Customers dashboard in PostHog to confirm revenue data is being linked to person profiles.
