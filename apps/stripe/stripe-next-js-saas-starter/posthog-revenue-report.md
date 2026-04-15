# PostHog Revenue Analytics Setup Report

## Summary

Stripe revenue data has been connected to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects created during checkout. This enables the Top Customers dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table in PostHog.

## PostHog distinct_id

The project uses `String(user.id)` (the user's numeric database ID, cast to string) as the PostHog distinct_id. This was confirmed from multiple `posthog.identify` and `posthog.capture` calls throughout the codebase.

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` metadata to the `stripe.checkout.sessions.create` call in the `createCheckoutSession` function:

1. **Checkout session `metadata`** — Added `posthog_person_distinct_id: String(user.id)` so the session itself carries the PostHog identity.
2. **`subscription_data.metadata`** — Added `posthog_person_distinct_id: String(user.id)` so the Stripe Subscription object created from this checkout session carries the identity. This is the key field PostHog uses for revenue attribution.

The `user` variable was already in scope (retrieved via `getUser()` at the top of the function), and `client_reference_id` was already correctly set to `user.id.toString()` — no additional changes were needed there.

No new files were created. No new Stripe API calls were added.

## Manual Steps

No manual steps are required for the code changes to take effect. However, to fully enable PostHog Revenue Analytics:

1. **Enable the Revenue Analytics feature in PostHog** — Go to your PostHog project settings and enable the Revenue Analytics data pipeline / integration if it is not already active.
2. **Configure the Stripe data connector in PostHog** — In PostHog, navigate to Data Pipelines and connect your Stripe account so PostHog can ingest Stripe events alongside the `posthog_person_distinct_id` metadata.
3. **Verify with a test checkout** — Complete a test Stripe checkout and confirm in PostHog that the subscription and payment events are attributed to the correct person via the `posthog_person_distinct_id` metadata field.
