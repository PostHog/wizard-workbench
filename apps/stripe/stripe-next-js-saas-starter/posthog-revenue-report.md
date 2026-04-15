# PostHog Revenue Analytics Setup Report

## Summary

PostHog revenue analytics has been connected to this Stripe Next.js SaaS starter by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables PostHog to link Stripe revenue data to PostHog persons, powering the Top Customers dashboard, `persons_revenue_analytics` table, and `groups_revenue_analytics` table.

## PostHog distinct_id

The project identifies users with `String(user.id)` — the user's numeric database ID converted to a string. This value is threaded into all Stripe metadata.

## Changes Made

### Modified Files

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` metadata to the `stripe.checkout.sessions.create()` call in `createCheckoutSession`:

- Added top-level `metadata.posthog_person_distinct_id` on the Checkout Session, so PostHog can associate the session with the person.
- Added `subscription_data.metadata.posthog_person_distinct_id` on the Subscription created by the checkout, so PostHog can link recurring revenue to the person.

The `client_reference_id` was already set to `user.id.toString()` prior to this change.

## No New Files Created

No new files were created. Only `lib/payments/stripe.ts` was modified.

## Manual Steps

No manual steps are required for the code changes to take effect. However, to fully enable PostHog revenue analytics:

1. **Connect your Stripe account in PostHog** — Go to PostHog → Data Pipelines → Sources and add your Stripe account as a data source. This imports historical revenue data.

2. **Verify the integration** — After your next checkout, open PostHog and check the Revenue Analytics section. You should see customers linked to person profiles via `posthog_person_distinct_id`.

3. **Historical customers** — Existing Stripe customers created before this change will not have `posthog_person_distinct_id` metadata. Only new checkouts going forward will be automatically linked. Historical data can be connected via the PostHog data warehouse Stripe source.
