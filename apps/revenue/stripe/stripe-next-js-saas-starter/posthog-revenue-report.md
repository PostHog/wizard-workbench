# PostHog Revenue Analytics Setup Report

## Summary

PostHog revenue analytics has been connected to this Stripe Next.js SaaS starter by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables the Top Customers dashboard and `persons_revenue_analytics` / `groups_revenue_analytics` tables in PostHog.

## PostHog distinct_id

The project uses `String(user.id)` (the numeric database user ID converted to a string) as the PostHog distinct_id, consistent with all existing `posthog.identify` and `posthog.capture` calls throughout the codebase.

## Changes Made

### Files Modified

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` metadata to the `stripe.checkout.sessions.create()` call in `createCheckoutSession`:

- `metadata.posthog_person_distinct_id` — tags the Checkout Session itself with the user's distinct_id
- `subscription_data.metadata.posthog_person_distinct_id` — tags the Subscription created by the checkout session with the user's distinct_id

The `user` object is already in scope from `getUser()` at the top of the function, so no new data fetching was needed.

### Files Created

- `posthog-revenue-report.md` (this file)

## What Was Not Changed

- No new Stripe API calls were added
- No existing logic, imports, or error handling was modified
- The seed file (`lib/db/seed.ts`) was not modified — it only creates products/prices, not customers
- The webhook handler (`app/api/stripe/webhook/route.ts`) was not modified — it handles subscription updates, not creation

## How It Works

When a user initiates a subscription checkout:

1. `createCheckoutSession` creates a Stripe Checkout Session with `posthog_person_distinct_id` in both the session `metadata` and `subscription_data.metadata`
2. Stripe auto-creates a Customer and Subscription during checkout completion
3. The Subscription object carries the `posthog_person_distinct_id` metadata, which PostHog uses to link revenue events to the correct person

## Manual Steps Required

No manual steps are required for the code changes. However, to fully activate PostHog revenue analytics:

1. **Enable Revenue Analytics in PostHog** — Go to your PostHog project settings and enable the Revenue Analytics feature if it is not already active.
2. **Connect your Stripe account** — In PostHog, navigate to Data pipelines or Integrations and connect your Stripe account so PostHog can ingest revenue data.
3. **Deploy the changes** — Deploy the updated `lib/payments/stripe.ts` to your production environment.
4. **Verify** — After the next subscription checkout, confirm in PostHog that the person profile for the purchasing user shows revenue data.
