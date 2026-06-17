# PostHog Revenue Analytics Setup Report

## Summary

Connected Stripe revenue data to PostHog by adding `posthog_person_distinct_id` metadata to Stripe objects. This enables PostHog to link Stripe payments to PostHog person profiles for the Top Customers dashboard and the `persons_revenue_analytics` / `groups_revenue_analytics` data warehouse tables.

## PostHog Distinct ID

The codebase uses `String(user.id)` (the user's numeric database ID as a string) as the PostHog distinct ID. This was confirmed from multiple `posthog.identify({ distinctId: String(user.id), ... })` calls throughout the codebase.

## Changes Made

### Files Modified

**`lib/payments/stripe.ts`**

Added `posthog_person_distinct_id` metadata to the Stripe Checkout Session creation in `createCheckoutSession()`:

- Added `metadata.posthog_person_distinct_id` at the session level
- Added `subscription_data.metadata.posthog_person_distinct_id` so the subscription object itself carries the metadata (required for PostHog revenue analytics to resolve the person)
- The `client_reference_id` was already set to `user.id.toString()` (the distinct ID); no change needed there

The value used is `String(user.id)`, consistent with the PostHog identify calls in the rest of the app.

## What Was Not Changed

- No new Stripe API calls were added
- No Customer creation calls exist in this codebase — customers are created automatically by Stripe Checkout
- The webhook handler (`app/api/stripe/webhook/route.ts`) only handles subscription updates/cancellations; no object creation occurs there
- The checkout success handler (`app/api/stripe/checkout/route.ts`) only retrieves and reads Stripe objects; no creation there either

## Manual Steps

1. **Deploy the changes** to your production environment so the next checkout session created will include the PostHog metadata.

2. **Connect Stripe as a data source in PostHog**: Go to [Data warehouse](https://us.posthog.com/project/2/data-warehouse) in PostHog and add Stripe as a source if you haven't already.

3. **Existing customers**: For customers created before this change, PostHog will pick up `posthog_person_distinct_id` from the metadata of their next subscription renewal or any new subscription/charge. No backfill is required — PostHog reads from the most recently created child object.

4. **Verify** by completing a test checkout and checking that the subscription in Stripe shows `posthog_person_distinct_id` in its metadata.
