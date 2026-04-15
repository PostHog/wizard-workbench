# PostHog Revenue Analytics Setup Report

## Summary

This report describes the changes made to connect Stripe revenue data to PostHog revenue analytics. PostHog uses the `posthog_person_distinct_id` metadata field on Stripe objects to link payments to PostHog persons, enabling the Top Customers dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table.

## PostHog Distinct ID

The project identifies users in PostHog using `String(user.id)` — the numeric database user ID converted to a string. This is confirmed by:

- `app/(login)/actions.ts`: `posthog.identify({ distinctId: String(foundUser.id), ... })`
- `app/(dashboard)/layout.tsx`: `posthog.identify(String(userData.id), ...)`

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id: String(user.id)` metadata to the `stripe.checkout.sessions.create` call inside `createCheckoutSession`:

1. **Session-level metadata** — `metadata.posthog_person_distinct_id` on the checkout session itself.
2. **Subscription metadata** — `subscription_data.metadata.posthog_person_distinct_id` so the Stripe Subscription object carries the field (required for PostHog revenue analytics to link subscriptions to persons).

The `client_reference_id` was already set to `user.id.toString()` (the same distinct_id value), which is used by the checkout success handler to look up the user.

No new files were created. No new Stripe API calls were introduced.

## No Explicit Customer Creation

There is no `stripe.customers.create` call in this codebase. Stripe automatically creates the customer during the first checkout session. The `posthog_person_distinct_id` will be propagated to the subscription via `subscription_data.metadata`.

## Manual Steps

1. **Backfill existing Stripe customers** — Existing customers created before this change will not have the `posthog_person_distinct_id` metadata. You can backfill them manually via the Stripe dashboard or API by updating each customer's metadata with their corresponding PostHog distinct ID (`String(user.id)`).

2. **Connect Stripe as a data source in PostHog** — Go to PostHog → Data Pipeline → Sources and add your Stripe account if you haven't already. This enables the revenue analytics dashboards and tables.

3. **Verify in Stripe** — After a test checkout, confirm that the new subscription in Stripe has `posthog_person_distinct_id` set under its metadata.
