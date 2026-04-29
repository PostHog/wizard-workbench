# PostHog Revenue Analytics Setup Report

## Summary

PostHog revenue analytics has been connected to Stripe by adding `posthog_person_distinct_id` metadata to Stripe objects created during checkout. This enables the Top Customers dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table in PostHog.

## PostHog distinct_id

The project identifies users with `String(user.id)` — a string representation of the database user's numeric ID. This is confirmed by `posthog.identify` calls in `app/(login)/actions.ts` and `app/(dashboard)/layout.tsx`.

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`** — `createCheckoutSession` function

Added `posthog_person_distinct_id: String(user.id)` to two places within the existing `stripe.checkout.sessions.create` call:

1. **Session `metadata`** — tags the Checkout Session itself with the PostHog distinct_id.
2. **`subscription_data.metadata`** — tags the resulting Stripe Subscription object so PostHog can link revenue events to the correct person.

The `user` object is already retrieved at the top of the function (`const user = await getUser()`), so no new API calls or parameter threading were required.

No other files were modified. There are no explicit `stripe.customers.create` calls in this codebase — Stripe auto-creates the customer during the checkout flow.

## No New Files Created

No new files were added as part of this integration.

## Manual Steps

No manual steps are required in the application code. To complete the PostHog revenue analytics setup:

1. **Connect Stripe as a data source in PostHog** — Go to PostHog > Data pipelines > Sources and add your Stripe account if you haven't already.
2. **Verify metadata in Stripe** — After a test checkout, confirm that the Checkout Session and Subscription objects in the Stripe Dashboard show `posthog_person_distinct_id` in their metadata.
3. **Check PostHog Revenue Analytics** — Once data flows in, the Top Customers dashboard and revenue tables (`persons_revenue_analytics`, `groups_revenue_analytics`) will populate automatically.
