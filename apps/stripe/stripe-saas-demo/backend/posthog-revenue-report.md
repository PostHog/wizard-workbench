# PostHog Revenue Analytics Setup Report

## Summary

Added `posthog_person_distinct_id` metadata to Stripe objects so PostHog can link Stripe revenue data to PostHog persons. This enables the **Top Customers** dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table in PostHog.

The distinct_id used is `posthogDistinctId || email` — matching the value passed to `posthog.identify()` in the codebase.

## Files Modified

### `routes/customers.ts`
- Added `metadata: { posthog_person_distinct_id: posthogDistinctId || email }` to `stripe.customers.create()`

### `routes/checkout.ts`
- Added `metadata: { posthog_person_distinct_id: userId || customerEmail }` to `stripe.checkout.sessions.create()`
- `client_reference_id` was already set to `userId` (used by the webhook handler)

### `routes/subscriptions.ts`
- Moved user lookup (`getUser(userId)`) out of the `if (userId)` block so it is accessible at the `stripe.subscriptions.create()` call site
- Added `...(user && { metadata: { posthog_person_distinct_id: user.posthogDistinctId || user.email } })` to `stripe.subscriptions.create()`
- Metadata is only set when a user record is found (avoids fabricating an incorrect distinct_id)

## What Was NOT Changed

- No new Stripe API calls were added
- No existing charge, payment, or subscription logic was modified
- No new packages or dependencies were added
- `routes/webhooks.ts` was not modified — it only receives events and does not create Stripe objects

## Next Steps for the User

1. **Enable Revenue Analytics in PostHog**: Go to your PostHog project settings and enable the Stripe revenue analytics integration, pointing it to the same Stripe account.
2. **Connect your Stripe account**: In PostHog under *Data pipelines* or *Revenue analytics*, link your Stripe account so PostHog can ingest Stripe data.
3. **Test end-to-end**: Create a test customer and subscription, then verify the `posthog_person_distinct_id` appears on the Stripe customer/subscription metadata in the Stripe dashboard.
4. **Check PostHog**: After a short sync delay, verify that the Top Customers dashboard and `persons_revenue_analytics` table show data linked to your PostHog persons.
